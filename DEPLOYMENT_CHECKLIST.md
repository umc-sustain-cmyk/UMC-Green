# 📋 GreenMarket Red Hat Deployment Checklist

## Pre-Deployment

- [ ] Server access confirmed: SSH to `umc-green-project-prd-app-01.oit.umn.edu`
- [ ] Credentials verified (username: Khadk046, password available)
- [ ] Repository cloned to `/opt/greenmarket`
- [ ] All deployment scripts are executable

## Phase 1: Server Setup

### Environment Preparation
```bash
sudo bash scripts/setup-redhat.sh
```

- [ ] Node.js 18.x installed
- [ ] Nginx installed
- [ ] MySQL Server installed
- [ ] PM2 installed
- [ ] Git installed
- [ ] Certbot installed
- [ ] /opt/greenmarket directory created
- [ ] /etc/greenmarket directory created

## Phase 2: Database Setup

### MySQL Configuration
```bash
sudo mysql -u root -p
```

- [ ] Created database: `greenmarket_prod`
- [ ] Created user: `greenmarket_user`
- [ ] Set strong password for `greenmarket_user`
- [ ] Granted all privileges
- [ ] Tested connection with new user

**Database Credentials Recorded:**
- Username: `greenmarket_user`
- Password: _________________ (keep secure)
- Database: `greenmarket_prod`
- Host: `localhost`
- Port: `3306`

## Phase 3: Environment Configuration

### Create Production .env File

```bash
sudo cp scripts/.env.production.template /etc/greenmarket/.env
sudo nano /etc/greenmarket/.env
```

- [ ] DB_HOST = `localhost`
- [ ] DB_PORT = `3306`
- [ ] DB_USER = `greenmarket_user`
- [ ] DB_PASSWORD = _____________ (from Phase 2)
- [ ] DB_NAME = `greenmarket_prod`
- [ ] NODE_ENV = `production`
- [ ] PORT = `5000`
- [ ] JWT_SECRET = (generated with `openssl rand -base64 32`)
- [ ] FRONTEND_URL = `https://umc-green-project-prd-app-01.oit.umn.edu`
- [ ] File permissions set to 600 (`sudo chmod 600 /etc/greenmarket/.env`)

**Generated JWT Secret:**
- JWT_SECRET: ________________________________________________________

## Phase 4: Application Deployment

### Deploy Application
```bash
bash scripts/deploy.sh
```

- [ ] Backend dependencies installed
- [ ] Frontend built successfully
- [ ] Database migrations executed
- [ ] Database seeders completed (optional)
- [ ] Backend started with PM2
- [ ] PM2 configuration saved
- [ ] Nginx configuration created
- [ ] Nginx syntax validated
- [ ] Nginx restarted

### Verify Deployment
```bash
# Check backend
pm2 status
pm2 logs greenmarket-api

# Test locally
curl http://localhost:5000

# Check Nginx
sudo systemctl status nginx
```

- [ ] Backend process running in PM2
- [ ] Nginx service running
- [ ] No errors in logs
- [ ] Local API test successful

## Phase 5: SSL/HTTPS Setup

### Install SSL Certificate
```bash
sudo certbot --nginx -d umc-green-project-prd-app-01.oit.umn.edu
```

- [ ] Certbot installed and configured
- [ ] SSL certificate obtained from Let's Encrypt
- [ ] HTTP redirects to HTTPS
- [ ] HTTPS connection working
- [ ] Auto-renewal enabled

### Verify SSL
```bash
curl -I https://umc-green-project-prd-app-01.oit.umn.edu
sudo certbot certificates
```

- [ ] SSL certificate installed
- [ ] Certificate details reviewed
- [ ] Auto-renewal scheduled
- [ ] Dry-run renewal successful

## Phase 6: Testing & Validation

### Endpoint Testing
```bash
# Frontend
curl -I https://umc-green-project-prd-app-01.oit.umn.edu/

# Backend API
curl https://umc-green-project-prd-app-01.oit.umn.edu/api/health

# Health check
curl https://umc-green-project-prd-app-01.oit.umn.edu/health
```

- [ ] Frontend loads successfully
- [ ] Backend API responding
- [ ] Health check endpoints working
- [ ] CORS headers present
- [ ] SSL certificate valid

### Log Review
```bash
pm2 logs greenmarket-api
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

- [ ] No errors in backend logs
- [ ] No errors in Nginx logs
- [ ] Request logs show traffic
- [ ] Database queries working

## Phase 7: Security Hardening

### Security Checks
- [ ] Changed MySQL root password
- [ ] DB user has minimal required privileges
- [ ] Environment file is locked down (600 permissions)
- [ ] Firewall rules configured appropriately
- [ ] SSH key authentication preferred over passwords
- [ ] Regular security updates scheduled

### Backup & Recovery
- [ ] Database backup created
- [ ] Backup stored in secure location
- [ ] Backup restoration procedure tested
- [ ] Backup retention policy established

## Phase 8: Monitoring & Maintenance

### Setup Monitoring
- [ ] PM2 ecosystem file created for persistence
- [ ] PM2 startup script installed
- [ ] Maintenance script tested: `bash scripts/maintenance.sh`
- [ ] Log rotation configured
- [ ] Disk space monitoring set up
- [ ] CPU/Memory thresholds defined

### Scheduled Tasks
- [ ] Daily backup scheduled (optional)
- [ ] Weekly log review scheduled
- [ ] Monthly SSL renewal check
- [ ] System update schedule defined

## Post-Deployment Checklist

### Application Testing
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens generated correctly
- [ ] Item creation works
- [ ] Item listing works
- [ ] File uploads work (if implemented)

### Performance Testing
- [ ] Response times acceptable
- [ ] Database queries optimized
- [ ] Nginx caching configured
- [ ] No memory leaks observed
- [ ] CPU usage reasonable

### Documentation
- [ ] Deployment procedure documented
- [ ] Environment variables documented
- [ ] Database schema documented
- [ ] API endpoints documented
- [ ] Troubleshooting guide created

## Common Issues & Solutions

### Backend won't start
- [ ] Check PM2 logs: `pm2 logs greenmarket-api`
- [ ] Verify environment file: `sudo cat /etc/greenmarket/.env`
- [ ] Verify database connection
- [ ] Check Node.js version

### Database connection error
- [ ] Verify MySQL is running: `sudo systemctl status mysqld`
- [ ] Test credentials: `mysql -u greenmarket_user -p`
- [ ] Check firewall rules
- [ ] Verify credentials in .env

### Nginx not serving content
- [ ] Check syntax: `sudo nginx -t`
- [ ] Verify config: `sudo cat /etc/nginx/conf.d/greenmarket.conf`
- [ ] Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] Verify upstream server running

### Port conflicts
- [ ] Find process: `sudo lsof -i :5000`
- [ ] Kill process: `sudo kill -9 <PID>`
- [ ] Restart backend: `pm2 restart greenmarket-api`

## Maintenance Schedule

### Daily
- [ ] Check backend status: `pm2 status`
- [ ] Monitor for errors: `pm2 logs greenmarket-api | grep ERROR`

### Weekly
- [ ] Review access logs
- [ ] Check disk usage: `df -h`
- [ ] Verify backups completed

### Monthly
- [ ] SSL certificate check
- [ ] Database optimization
- [ ] Security updates
- [ ] Performance review

### Quarterly
- [ ] Full backup test/restore
- [ ] Disaster recovery drill
- [ ] Security audit
- [ ] Capacity planning

## Rollback Plan

In case of issues:

1. **Stop current deployment**
   ```bash
   pm2 stop greenmarket-api
   sudo systemctl stop nginx
   ```

2. **Revert code**
   ```bash
   cd /opt/greenmarket
   git revert HEAD
   ```

3. **Rerun deployment**
   ```bash
   bash scripts/deploy.sh
   ```

4. **Restore database** (if needed)
   ```bash
   mysql -u greenmarket_user -p greenmarket_prod < /opt/greenmarket/backups/backup.sql
   ```

## Success Criteria

- ✅ Application accessible at `https://umc-green-project-prd-app-01.oit.umn.edu`
- ✅ All API endpoints responding
- ✅ SSL certificate valid and auto-renewing
- ✅ Database persisting data correctly
- ✅ PM2 managing backend process
- ✅ Nginx serving frontend and proxying API
- ✅ Monitoring and logging active
- ✅ Backups scheduled and tested
- ✅ No critical errors in logs
- ✅ Performance metrics acceptable

---

## Sign-Off

- **Deployment Date**: _________________
- **Deployed By**: _________________
- **Reviewed By**: _________________
- **Issues Encountered**: None / See notes below

**Additional Notes:**
```
[Space for notes on any issues or customizations]




```

---

**Document Version**: 1.0
**Last Updated**: 2026-04-22
