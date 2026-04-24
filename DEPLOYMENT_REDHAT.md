# Deployment Guide: Red Hat Server

## Server Information
- **Production Server**: umc-green-project-prd-app-01.oit.umn.edu
- **Username**: Khadk046
- **OS**: Red Hat Enterprise Linux (RHEL)

## Prerequisites Checklist

### 1. Server Environment Setup
```bash
# Connect to server
ssh Khadk046@umc-green-project-prd-app-01.oit.umn.edu

# Verify OS
cat /etc/os-release

# Update system
sudo yum update -y

# Install Node.js 18.x (Required by project)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version

# Install Git
sudo yum install -y git

# Install nginx (reverse proxy)
sudo yum install -y nginx

# Install MySQL 8.0 (or MariaDB)
sudo yum install -y mysql-server

# Install PM2 (process manager)
sudo npm install -g pm2

# Install certbot for SSL (if needed)
sudo yum install -y certbot python3-certbot-nginx
```

### 2. Database Setup
```bash
# Start MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Secure installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE greenmarket_prod;
CREATE USER 'greenmarket_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON greenmarket_prod.* TO 'greenmarket_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Deployment Steps

### 3. Clone Repository
```bash
cd /opt
sudo git clone https://github.com/YOUR_REPO_URL greenmarket
sudo chown -R $USER:$USER greenmarket
cd greenmarket
```

### 4. Backend Setup & Installation
```bash
cd greenmarket-backend

# Install dependencies
npm install --production

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=greenmarket_user
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_NAME=greenmarket_prod
JWT_SECRET=YOUR_VERY_SECURE_JWT_SECRET_HERE_CHANGE_ME
FRONTEND_URL=https://umc-green.vercel.app
EOF

# Run migrations
npm run migrate

# Run seeders (optional)
npm run seed

# Test backend
npm start
# Should see: "✅ Server is running on port 5000"
# Press Ctrl+C to stop
```

### 5. Frontend Build & Deployment
```bash
cd ../greenmarket-frontend

# Install dependencies
npm install

# Update API endpoint in src/services/api.js
# Ensure it points to your server's API URL

# Build for production
npm run build

# The built files are now in dist/
```

### 6. Setup PM2 for Backend
```bash
cd /opt/greenmarket/greenmarket-backend

# Start with PM2
pm2 start server.js --name "greenmarket-api"

# Save PM2 config to restart on reboot
pm2 startup
pm2 save

# Verify it's running
pm2 status
pm2 logs greenmarket-api
```

### 7. Nginx Configuration (Reverse Proxy)
```bash
# Create nginx config
sudo tee /etc/nginx/conf.d/greenmarket.conf > /dev/null << 'EOF'
upstream greenmarket_api {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name umc-green-project-prd-app-01.oit.umn.edu;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

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
    }

    # Serve frontend (if hosting on same server)
    location / {
        root /opt/greenmarket/greenmarket-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Test nginx config
sudo nginx -t

# Enable and start nginx
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl restart nginx
```

### 8. SSL Certificate Setup (HTTPS)
```bash
# Using Let's Encrypt with Certbot
sudo certbot --nginx -d umc-green-project-prd-app-01.oit.umn.edu

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify renewal
sudo certbot renew --dry-run
```

## Verification Checklist

- [ ] SSH connection successful
- [ ] Node.js 18.x installed
- [ ] MySQL running and database created
- [ ] Backend cloned and dependencies installed
- [ ] .env file configured with correct database credentials
- [ ] Migrations run successfully
- [ ] PM2 running backend process
- [ ] Nginx configured and running
- [ ] Backend API accessible at `http://localhost:5000`
- [ ] SSL certificate installed
- [ ] Frontend built and serving

## Testing the Deployment

```bash
# Test backend API
curl http://localhost:5000/health

# Test from local machine
curl https://umc-green-project-prd-app-01.oit.umn.edu/api/health

# Check PM2 logs
pm2 logs greenmarket-api

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Environment Variables to Set

**CRITICAL**: Store these securely in the server's environment, never in code:

```
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=greenmarket_user
DB_PASSWORD=<secure_password>
DB_NAME=greenmarket_prod
JWT_SECRET=<random_secure_secret_min_32_chars>
FRONTEND_URL=https://umc-green.vercel.app
```

## Maintenance Commands

```bash
# View running processes
pm2 status

# View logs
pm2 logs greenmarket-api

# Restart backend
pm2 restart greenmarket-api

# Stop/Start
pm2 stop greenmarket-api
pm2 start greenmarket-api

# Reload nginx
sudo systemctl reload nginx

# View nginx status
sudo systemctl status nginx
```

## Troubleshooting

### Backend won't start
```bash
pm2 logs greenmarket-api
# Check error messages in logs
```

### Database connection error
```bash
# Verify MySQL is running
sudo systemctl status mysqld

# Test connection
mysql -u greenmarket_user -p greenmarket_prod
```

### Nginx not loading pages
```bash
# Check config syntax
sudo nginx -t

# Restart
sudo systemctl restart nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Port 5000 already in use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process if needed
sudo kill -9 <PID>
```

## Next Steps

1. SSH into the production server
2. Follow the "Prerequisites Checklist" section
3. Complete "Deployment Steps" 1-8
4. Use "Verification Checklist" to validate
5. Test endpoints and monitor logs

---

**Last Updated**: 2026-04-22
