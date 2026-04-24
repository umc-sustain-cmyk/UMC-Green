# 🚀 GreenMarket Red Hat Server Deployment

## Overview

This directory contains all necessary documentation and scripts to deploy the **GreenMarket** application (Node.js backend + React frontend) to the Red Hat production server at `umc-green-project-prd-app-01.oit.umn.edu`.

---

## Quick Links

| Document | Purpose |
|----------|---------|
| 📋 [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md) | **Start here** - Step-by-step deployment guide |
| 📋 [DEPLOYMENT_REDHAT.md](DEPLOYMENT_REDHAT.md) | Detailed technical guide for Red Hat setup |
| ✅ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Comprehensive checklist to track progress |
| 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues and solutions |

---

## What's Included

### Documentation
- **DEPLOYMENT_QUICKSTART.md** - Quick-start guide (6 phases)
- **DEPLOYMENT_REDHAT.md** - Detailed technical documentation
- **DEPLOYMENT_CHECKLIST.md** - Progress tracking checklist
- **TROUBLESHOOTING.md** - Common issues and solutions

### Scripts (`scripts/` directory)
- **setup-redhat.sh** - Initial server environment setup
- **deploy.sh** - Full application deployment
- **maintenance.sh** - Interactive maintenance menu
- **.env.production.template** - Environment configuration template

### Project Structure
```
UMC-Green/
├── greenmarket-backend/          # Node.js/Express backend
│   ├── server.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── migrations/
│   └── package.json
├── greenmarket-frontend/         # React/Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── scripts/                      # Deployment scripts
    ├── setup-redhat.sh
    ├── deploy.sh
    ├── maintenance.sh
    └── .env.production.template
```

---

## System Requirements

- **OS**: Red Hat Enterprise Linux (RHEL) 7.x or 8.x+
- **Node.js**: 18.x or higher
- **MySQL**: 8.0+
- **Disk Space**: Minimum 5GB free
- **Memory**: Minimum 2GB RAM (4GB+ recommended)
- **Port Access**: 
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 443 (HTTPS)
  - Port 3306 (MySQL - local only)

---

## Deployment Overview

### Phase 1: Server Setup (30 minutes)
Set up the Red Hat environment with required packages

### Phase 2: Database Setup (10 minutes)
Create MySQL database and user for the application

### Phase 3: Configuration (5 minutes)
Set up environment variables and secrets

### Phase 4: Deployment (15 minutes)
Deploy backend, frontend, and configure Nginx

### Phase 5: SSL/HTTPS (10 minutes)
Install and configure SSL certificate

### Phase 6: Testing (10 minutes)
Verify all services are working correctly

**Total Estimated Time**: ~90 minutes for initial deployment

---

## Getting Started

### Step 1: Read the Quick Start
👉 **Start with [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md)**

This provides a condensed, easy-to-follow guide for the entire deployment process.

### Step 2: Follow the Checklist
Use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to track your progress through each phase.

### Step 3: Refer to Detailed Docs
For technical details or specific configuration, consult [DEPLOYMENT_REDHAT.md](DEPLOYMENT_REDHAT.md).

### Step 4: Troubleshoot as Needed
If you encounter issues, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions.

---

## Server Information

| Item | Value |
|------|-------|
| **Server URL** | umc-green-project-prd-app-01.oit.umn.edu |
| **SSH Access** | `ssh Khadk046@umc-green-project-prd-app-01.oit.umn.edu` |
| **App Directory** | `/opt/greenmarket` |
| **Config Directory** | `/etc/greenmarket` |
| **Backend Port** | 5000 |
| **Frontend Port** | 80/443 (via Nginx) |
| **Database Port** | 3306 |

---

## Critical Files & Locations

### Configuration
- **Environment File**: `/etc/greenmarket/.env` (must be created)
- **Nginx Config**: `/etc/nginx/conf.d/greenmarket.conf`
- **Backend**: `/opt/greenmarket/greenmarket-backend`
- **Frontend Build**: `/opt/greenmarket/greenmarket-frontend/dist`

### Logs
- **Backend Logs**: Managed by PM2 (`pm2 logs greenmarket-api`)
- **Nginx Access**: `/var/log/nginx/access.log`
- **Nginx Errors**: `/var/log/nginx/error.log`
- **MySQL Logs**: `/var/log/mysqld.log`

---

## Key Commands

```bash
# SSH to server
ssh Khadk046@umc-green-project-prd-app-01.oit.umn.edu

# Initial setup (run once)
sudo bash scripts/setup-redhat.sh

# Deploy application
bash scripts/deploy.sh

# Maintenance menu
bash scripts/maintenance.sh

# Check backend status
pm2 status

# View backend logs
pm2 logs greenmarket-api -f

# Restart backend
pm2 restart greenmarket-api

# Restart Nginx
sudo systemctl restart nginx

# Check database connection
mysql -u greenmarket_user -p greenmarket_prod
```

---

## Environment Variables

Required environment variables (set in `/etc/greenmarket/.env`):

```
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=greenmarket_user
DB_PASSWORD=<secure_password>
DB_NAME=greenmarket_prod
JWT_SECRET=<random_secure_secret>
FRONTEND_URL=https://umc-green-project-prd-app-01.oit.umn.edu
```

**Important**: Never commit `.env` to version control. Use the template file to create a local copy.

---

## Technology Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MySQL 8.0 with Sequelize ORM
- **Authentication**: JWT with bcrypt password hashing
- **Security**: Helmet, CORS, rate limiting
- **Process Manager**: PM2

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: CSS (custom)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Components**: Lucide React

### Infrastructure
- **Web Server**: Nginx (reverse proxy)
- **SSL**: Let's Encrypt (Certbot)
- **Process Management**: PM2
- **Version Control**: Git

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│          HTTPS (Let's Encrypt)                  │
│         Port 80/443 (Internet)                  │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────▼─────────────┐
        │   NGINX (Reverse Proxy) │
        │   Port 80/443           │
        └──────────┬──────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐  ┌────────▼────────┐
│   STATIC FILES │  │  API PROXY      │
│  (React Dist)  │  │  (Port 5000)    │
└────────────────┘  └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Node.js Backend │
                    │   (Express)     │
                    │   Port 5000     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    MySQL 8.0    │
                    │   Port 3306     │
                    └─────────────────┘
```

---

## Backup & Recovery

### Regular Backups
```bash
# Create database backup
bash scripts/maintenance.sh
# Select option 12 (Backup Database)
```

### Restore from Backup
```bash
mysql -u greenmarket_user -p greenmarket_prod < /opt/greenmarket/backups/backup.sql
```

---

## Monitoring & Logs

### Real-time Monitoring
```bash
# Backend process
pm2 monit

# System resources
top

# Live backend logs
pm2 logs greenmarket-api -f

# Live access logs
sudo tail -f /var/log/nginx/access.log
```

### Maintenance Menu
```bash
bash scripts/maintenance.sh
```

Interactive menu with options to:
- View backend status
- View logs
- Restart services
- Check database
- View system resources
- Backup database
- Update SSL certificates
- And more...

---

## Security Best Practices

✅ **Do:**
- Store `.env` file securely with 600 permissions
- Use strong database passwords
- Enable SSL/HTTPS
- Regular security updates: `npm audit`
- Monitor access logs for suspicious activity
- Regular database backups
- Limit SSH access
- Use strong JWT secret

❌ **Don't:**
- Commit credentials to version control
- Use default database passwords
- Run without SSL
- Ignore security warnings
- Share credentials in chat/email
- Run services as root
- Disable authentication

---

## Troubleshooting

For common issues, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) which includes solutions for:

- Backend won't start
- Database connection errors
- Nginx not responding
- SSL certificate issues
- Deployment failures
- Performance problems
- And more...

---

## Support & Documentation

### Internal Resources
- Deployment Quickstart: [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md)
- Technical Guide: [DEPLOYMENT_REDHAT.md](DEPLOYMENT_REDHAT.md)
- Troubleshooting: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### External Resources
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Sequelize ORM](https://sequelize.org/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## Version Information

- **Project**: UMC-Green / GreenMarket
- **Backend**: Node.js 18.x, Express 4.x, Sequelize 6.x
- **Frontend**: React 18.x, Vite 5.x
- **Database**: MySQL 8.0
- **Deployment Date**: 2026-04-22

---

## Contact & Support

For deployment-related issues:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review the deployment logs
3. Consult [DEPLOYMENT_REDHAT.md](DEPLOYMENT_REDHAT.md) for technical details
4. Contact system administrator if further assistance needed

---

## License

UMC-Green Project - University of Minnesota Crookston
All materials provided as-is for deployment purposes.

---

**Document Version**: 1.0
**Last Updated**: 2026-04-22
**Status**: Ready for Production Deployment
