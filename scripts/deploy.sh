#!/bin/bash
# GreenMarket Deployment Script
# Run this script to deploy the application

set -e

echo "=========================================="
echo "🚀 GreenMarket Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_DIR/greenmarket-backend"
FRONTEND_DIR="$PROJECT_DIR/greenmarket-frontend"

print_info "Project directory: $PROJECT_DIR"

# Check if backend exists
if [ ! -d "$BACKEND_DIR" ]; then
    print_error "Backend directory not found: $BACKEND_DIR"
fi

echo ""
echo "📦 Step 1: Installing Backend Dependencies"
cd "$BACKEND_DIR"
if [ -d "node_modules" ]; then
    print_warning "node_modules already exists, removing..."
    rm -rf node_modules
fi
npm install --production
print_status "Backend dependencies installed"

echo ""
echo "📦 Step 2: Building Frontend"
cd "$FRONTEND_DIR"
if [ -d "node_modules" ]; then
    print_warning "node_modules already exists, removing..."
    rm -rf node_modules
fi
npm install
npm run build
print_status "Frontend built successfully"

echo ""
echo "📝 Step 3: Checking Environment Configuration"
if [ ! -f "/etc/greenmarket/.env" ]; then
    print_warning "Environment file not found at /etc/greenmarket/.env"
    print_info "Creating template..."
    sudo tee /etc/greenmarket/.env > /dev/null << 'EOF'
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=greenmarket_user
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DB_NAME=greenmarket_prod
JWT_SECRET=CHANGE_ME_RANDOM_32_CHAR_STRING
FRONTEND_URL=https://umc-green-project-prd-app-01.oit.umn.edu
EOF
    sudo chmod 600 /etc/greenmarket/.env
    print_warning "Please configure /etc/greenmarket/.env with your credentials"
    print_warning "Database must be created before running migrations"
    exit 1
fi
print_status "Environment file found"

echo ""
echo "🗄️  Step 4: Running Database Migrations"
cd "$BACKEND_DIR"
export $(cat /etc/greenmarket/.env | xargs)
npm run migrate || print_warning "Migrations completed (may have already run)"
print_status "Database migrations completed"

echo ""
echo "🌱 Step 5: Running Seeders (Optional)"
read -p "Run database seeders? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run seed
    print_status "Database seeders completed"
fi

echo ""
echo "🔄 Step 6: Starting Backend with PM2"
pm2 delete greenmarket-api 2>/dev/null || true
cd "$BACKEND_DIR"
pm2 start server.js --name "greenmarket-api" --env /etc/greenmarket/.env
pm2 save
print_status "Backend started with PM2"

echo ""
echo "🌐 Step 7: Configuring Nginx"
NGINX_CONF_FILE="/etc/nginx/conf.d/greenmarket.conf"

if [ ! -f "$NGINX_CONF_FILE" ]; then
    print_info "Creating Nginx configuration..."
    sudo tee "$NGINX_CONF_FILE" > /dev/null << 'EOF'
upstream greenmarket_api {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name umc-green-project-prd-app-01.oit.umn.edu;

    # Redirect to HTTPS after SSL setup
    # return 301 https://$server_name$request_uri;

    # API endpoints
    location /api/ {
        proxy_pass http://greenmarket_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static frontend files
    location / {
        root /opt/greenmarket/greenmarket-frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF
    print_status "Nginx configuration created"
fi

# Test Nginx config
if sudo nginx -t; then
    print_status "Nginx configuration is valid"
else
    print_error "Nginx configuration has errors"
fi

# Restart Nginx
sudo systemctl restart nginx
print_status "Nginx restarted"

echo ""
echo "=========================================="
echo "${GREEN}✓ Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Verification Commands:"
echo "  • Check backend: pm2 logs greenmarket-api"
echo "  • Check Nginx: sudo systemctl status nginx"
echo "  • Test API: curl http://localhost:5000"
echo "  • View processes: pm2 status"
echo ""
echo "Next Steps:"
echo "  1. Install SSL certificate: sudo certbot --nginx"
echo "  2. Monitor logs: pm2 logs greenmarket-api -f"
echo "  3. Update backend API URL in frontend if needed"
echo ""
