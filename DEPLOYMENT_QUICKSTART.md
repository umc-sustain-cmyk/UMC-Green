# 🚀 GreenMarket Red Hat Deployment - Quick Start Guide

## Summary
This guide will help you deploy the GreenMarket application (Node.js backend + React frontend) on the Red Hat production server.

**Server**: umc-green-project-prd-app-01.oit.umn.edu
**Username**: Khadk046

---

## Phase 1: Initial Server Setup (One-Time)

### Step 1a: SSH into the Production Server
```bash
ssh Khadk046@umc-green-project-prd-app-01.oit.umn.edu
# Enter your password
```

### Step 1b: Clone the Repository
```bash
cd /opt
git clone https://github.com/YOUR_GITHUB_REPO.git greenmarket
cd greenmarket
```

### Step 1c: Run Initial Setup Script
```bash
# Make script executable
chmod +x scripts/setup-redhat.sh

# Run with sudo (installs system packages)
sudo bash scripts/setup-redhat.sh
```

This script will:
- ✓ Update system packages
- ✓ Install Node.js 18.x
- ✓ Install Nginx
- ✓ Install MySQL Server
- ✓ Install PM2 (process manager)
- ✓ Install Certbot (SSL certificates)
- ✓ Create necessary directories

---

## Phase 2: Database Setup

### Step 2a: Create Database and User
```bash
# Connect to MySQL
sudo mysql -u root -p

# Run these SQL commands inside MySQL:
```

```sql
CREATE DATABASE greenmarket_prod;
CREATE USER 'greenmarket_user'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON greenmarket_prod.* TO 'greenmarket_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2b: Test Connection
```bash
# Verify the new user can connect
mysql -u greenmarket_user -p greenmarket_prod

# Type the password you set above
# If successful, you'll see the MySQL prompt
# Type: EXIT;
```

---

## Phase 3: Application Configuration

### Step 3a: Create Environment File
```bash
# Create production environment file
sudo cp scripts/.env.production.template /etc/greenmarket/.env

# Edit with your values
sudo nano /etc/greenmarket/.env
```

**Important values to update in .env:**
- `DB_PASSWORD=` ← Use the password you set in Phase 2
- `JWT_SECRET=` ← Generate with: `openssl rand -base64 32`
- `FRONTEND_URL=` ← Set to your frontend URL

```bash
# Secure the file (readable only by root)
sudo chmod 600 /etc/greenmarket/.env
```

### Step 3b: Make Deployment Script Executable
```bash
cd ~/greenmarket  # If not already there
chmod +x scripts/deploy.sh
```

---

## Phase 4: Deploy Application

### Step 4a: Run Deployment Script
```bash
# Execute deployment script
bash scripts/deploy.sh
```

The script will:
- ✓ Install backend dependencies
- ✓ Build frontend
- ✓ Run database migrations
- ✓ Start backend with PM2
- ✓ Configure Nginx
- ✓ Set up reverse proxy

### Step 4b: Verify Deployment
```bash
# Check if backend is running
pm2 status

# View backend logs
pm2 logs greenmarket-api

# Test API locally
curl http://localhost:5000

# Check Nginx status
sudo systemctl status nginx
```

---

## Phase 5: Setup HTTPS (SSL/TLS)

### Step 5a: Install SSL Certificate
```bash
# Run Certbot to get a free SSL certificate from Let's Encrypt
sudo certbot --nginx -d umc-green-project-prd-app-01.oit.umn.edu

# Follow the prompts:
# 1. Enter email for notifications
# 2. Agree to terms
# 3. Choose to redirect HTTP to HTTPS (recommended)
```

### Step 5b: Verify SSL
```bash
# Test your HTTPS connection
curl -I https://umc-green-project-prd-app-01.oit.umn.edu

# Check certificate details
sudo certbot certificates
```

### Step 5c: Auto-Renewal
```bash
# Enable automatic renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## Phase 6: Testing

### Test Endpoints
```bash
# Health check
curl https://umc-green-project-prd-app-01.oit.umn.edu/health

# Backend API (example)
curl https://umc-green-project-prd-app-01.oit.umn.edu/api/health

# Frontend
curl -I https://umc-green-project-prd-app-01.oit.umn.edu/
```

### Monitor Logs
```bash
# Backend logs (live)
pm2 logs greenmarket-api -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysqld.log
```

---

## Common Operations

### Restart Backend
```bash
pm2 restart greenmarket-api
```

### View Running Status
```bash
pm2 status
pm2 monit
```

### Redeploy Latest Code
```bash
cd /opt/greenmarket
git pull origin main
bash scripts/deploy.sh
```

### Update Environment Variables
```bash
# Edit the environment file
sudo nano /etc/greenmarket/.env

# Restart backend to apply changes
pm2 restart greenmarket-api
```

### Check Port Usage
```bash
# See what's using port 5000
sudo lsof -i :5000

# See what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443
```

---

## Troubleshooting

### Backend won't start
```bash
pm2 logs greenmarket-api
# Check for error messages and fix issues

# Clear PM2 and restart
pm2 delete greenmarket-api
cd /opt/greenmarket/greenmarket-backend
pm2 start server.js --name "greenmarket-api" --env /etc/greenmarket/.env
```

### Database connection error
```bash
# Verify MySQL is running
sudo systemctl status mysqld

# Check credentials in /etc/greenmarket/.env
sudo cat /etc/greenmarket/.env | grep DB_

# Test connection manually
mysql -u greenmarket_user -p -h localhost greenmarket_prod
```

### Port 5000 already in use
```bash
# Find and kill the process
sudo lsof -i :5000
sudo kill -9 <PID>

# Restart backend
pm2 restart greenmarket-api
```

### Nginx not loading
```bash
# Check configuration syntax
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## File Locations Reference

```
/opt/greenmarket/                    # Main application directory
├── greenmarket-backend/             # Backend source code
│   ├── server.js                   # Main server file
│   ├── config/                     # Configuration files
│   ├── models/                     # Database models
│   ├── routes/                     # API routes
│   └── node_modules/               # Backend dependencies
├── greenmarket-frontend/            # Frontend source code
│   ├── src/                        # React source
│   ├── dist/                       # Built/compiled frontend
│   └── node_modules/               # Frontend dependencies
└── scripts/                         # Deployment scripts

/etc/greenmarket/                   # Configuration directory
└── .env                            # Production environment variables

/var/log/                           # Logs
├── nginx/                          # Nginx logs
└── mysqld.log                      # MySQL logs
```

---

## Security Checklist

- [ ] Changed MySQL root password
- [ ] Created separate DB user with strong password
- [ ] Set proper permissions on /etc/greenmarket/.env (600)
- [ ] SSL certificate installed
- [ ] HTTP redirects to HTTPS
- [ ] Firewall rules configured appropriately
- [ ] Regular backups scheduled
- [ ] Monitor logs regularly
- [ ] Keep packages updated

---

## Support Resources

- **PM2 Docs**: https://pm2.keymetrics.io/docs/
- **Nginx Docs**: https://nginx.org/en/docs/
- **Certbot**: https://certbot.eff.org/
- **Node.js**: https://nodejs.org/en/docs/
- **Sequelize**: https://sequelize.org/

---

## Quick Commands Reference

| Task | Command |
|------|---------|
| SSH to server | `ssh Khadk046@umc-green-project-prd-app-01.oit.umn.edu` |
| Initial setup | `sudo bash scripts/setup-redhat.sh` |
| Deploy app | `bash scripts/deploy.sh` |
| View backend status | `pm2 status` |
| View backend logs | `pm2 logs greenmarket-api -f` |
| Restart backend | `pm2 restart greenmarket-api` |
| Restart Nginx | `sudo systemctl restart nginx` |
| Check SSL cert | `sudo certbot certificates` |
| View Nginx errors | `sudo tail -f /var/log/nginx/error.log` |
| Connect to DB | `mysql -u greenmarket_user -p greenmarket_prod` |

---

**Created**: 2026-04-22
**Last Updated**: 2026-04-22
