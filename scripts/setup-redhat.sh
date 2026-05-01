#!/bin/bash
# Red Hat Server Initial Setup Script
# Run this script once to configure the server environment

set -e  # Exit on error

echo "=========================================="
echo "🚀 GreenMarket Server Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if running with sudo
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run with sudo"
   exit 1
fi

# Update system
echo ""
echo "📦 Updating system packages..."
yum update -y
print_status "System packages updated"

# Install or upgrade Node.js 18.x
echo ""
echo "📦 Installing Node.js 18.x..."
CURRENT_NODE_MAJOR=0
if command -v node &> /dev/null; then
    CURRENT_NODE_MAJOR="$(node -v | sed 's/^v//' | cut -d. -f1)"
fi

if [ "$CURRENT_NODE_MAJOR" -lt 18 ]; then
    print_warning "Node.js is missing or older than 18 (current: ${CURRENT_NODE_MAJOR:-not installed}). Upgrading to Node.js 18.x..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
    print_status "Node.js installed: $(node --version)"
else
    print_warning "Node.js already meets the requirement: $(node --version)"
fi

# Install Git
echo ""
echo "📦 Installing Git..."
if ! command -v git &> /dev/null; then
    yum install -y git
    print_status "Git installed"
else
    print_warning "Git already installed"
fi

# Install Nginx
echo ""
echo "📦 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    yum install -y nginx
    systemctl enable nginx
    print_status "Nginx installed and enabled"
else
    print_warning "Nginx already installed"
fi

# Install MySQL Server
echo ""
echo "📦 Installing MySQL Server..."
if ! command -v mysql &> /dev/null; then
    yum install -y mysql-server
    systemctl enable mysqld
    systemctl start mysqld
    print_status "MySQL Server installed, enabled and started"
else
    print_warning "MySQL already installed"
fi

# Install PM2 globally
echo ""
echo "📦 Installing PM2..."
if ! npm install -g pm2 > /dev/null 2>&1; then
    print_error "PM2 installation failed"
    exit 1
fi

PM2_BIN_DIR="$(npm bin -g 2>/dev/null || true)"
if [ -n "$PM2_BIN_DIR" ]; then
    export PATH="$PM2_BIN_DIR:$PATH"
fi

if ! command -v pm2 >/dev/null 2>&1; then
    print_error "PM2 installed but not found on PATH. Try opening a new shell or add the npm global bin directory to PATH."
    exit 1
fi

print_status "PM2 installed: $(pm2 --version)"

# Install Certbot for SSL
echo ""
echo "📦 Installing Certbot..."
yum install -y certbot python3-certbot-nginx > /dev/null 2>&1
print_status "Certbot installed"

# Create application directory
echo ""
echo "📁 Creating application directory..."
if [ ! -d "/opt/greenmarket" ]; then
    mkdir -p /opt/greenmarket
    chown -R $SUDO_USER:$SUDO_USER /opt/greenmarket
    print_status "Application directory created: /opt/greenmarket"
else
    print_warning "Application directory already exists"
fi

# Create environment directory for storing secrets
echo ""
echo "📁 Creating environment configuration directory..."
mkdir -p /etc/greenmarket
chown root:root /etc/greenmarket
chmod 700 /etc/greenmarket
print_status "Environment configuration directory created"

echo ""
echo "=========================================="
echo "${GREEN}✓ Server Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Clone the repository: git clone <repo-url> /opt/greenmarket"
echo "2. Run the deployment script: bash /opt/greenmarket/scripts/deploy.sh"
echo "3. Configure .env file at /etc/greenmarket/.env"
echo ""
