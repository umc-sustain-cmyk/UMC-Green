# 🔧 GreenMarket Deployment Troubleshooting Guide

## Table of Contents
1. [Backend Issues](#backend-issues)
2. [Database Issues](#database-issues)
3. [Nginx/Web Server Issues](#nginxweb-server-issues)
4. [SSL/Certificate Issues](#sslcertificate-issues)
5. [Deployment Issues](#deployment-issues)
6. [Performance Issues](#performance-issues)
7. [Security Issues](#security-issues)

---

## Backend Issues

### Backend Process Won't Start

**Symptoms:**
- `pm2 status` shows "stopped" or "errored"
- Backend not responding to requests
- Error messages in PM2 logs

**Diagnosis:**
```bash
# Check PM2 status
pm2 status

# View detailed logs
pm2 logs greenmarket-api

# Check if port 5000 is in use
sudo lsof -i :5000

# Verify environment file exists
ls -la /etc/greenmarket/.env
```

**Solutions:**

1. **Check environment variables:**
   ```bash
   cat /etc/greenmarket/.env
   ```
   - Verify all required variables are present
   - Check for typos in variable names

2. **Verify Node.js installation:**
   ```bash
   node --version  # Should be 18.x
   npm --version
   ```

3. **Clear PM2 and restart:**
   ```bash
   pm2 delete greenmarket-api
   cd /opt/greenmarket/greenmarket-backend
   export $(cat /etc/greenmarket/.env | xargs)
   pm2 start server.js --name "greenmarket-api"
   pm2 logs greenmarket-api
   ```

4. **Check disk space:**
   ```bash
   df -h
   ```
   - Ensure at least 2GB free space

5. **Reinstall dependencies:**
   ```bash
   cd /opt/greenmarket/greenmarket-backend
   rm -rf node_modules
   npm install --production
   pm2 restart greenmarket-api
   ```

### Backend Crashing Frequently

**Symptoms:**
- PM2 shows "restarting" or "crashed" repeatedly
- Inconsistent behavior
- Memory leaks

**Diagnosis:**
```bash
# Monitor in real-time
pm2 monit

# Check system resources
free -h
ps aux --sort=-%mem | head -6

# View extended logs
pm2 logs greenmarket-api --lines 100
```

**Solutions:**

1. **Check memory usage:**
   ```bash
   # Increase max memory if needed
   pm2 start server.js --max-memory-restart 500M --name "greenmarket-api"
   ```

2. **Look for memory leaks in logs:**
   - Search for `OutOfMemory` errors
   - Check for database connection pool issues

3. **Verify database connectivity:**
   ```bash
   mysql -u greenmarket_user -p$(grep DB_PASSWORD /etc/greenmarket/.env | cut -d '=' -f 2) -h localhost greenmarket_prod
   ```

4. **Check system resources:**
   ```bash
   top
   vmstat 1 5
   ```

### Slow Response Times

**Symptoms:**
- API responses take 10+ seconds
- Timeout errors
- CPU at 100%

**Diagnosis:**
```bash
# Monitor backend in real-time
pm2 monit

# Test direct API call
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000

# Check database queries
# In backend logs, look for query timing
pm2 logs greenmarket-api | grep "ms"
```

**Solutions:**

1. **Check database performance:**
   ```bash
   # Connect to MySQL
   mysql -u greenmarket_user -p greenmarket_prod
   
   # Check slow query log
   SHOW PROCESSLIST;
   ```

2. **Add database indexes:**
   - Review [mongodb-query-optimizer SKILL](../skills/mongodb-query-optimizer/) (if using MongoDB)
   - Or check MySQL query optimization

3. **Enable query logging temporarily:**
   ```bash
   # Add to .env
   DEBUG=greenmarket:*
   
   # Restart backend
   pm2 restart greenmarket-api
   ```

---

## Database Issues

### Database Connection Error

**Symptoms:**
- "ECONNREFUSED" errors
- "Connection timeout" errors
- Can't connect to MySQL

**Diagnosis:**
```bash
# Check MySQL status
sudo systemctl status mysqld

# Try connecting directly
mysql -u greenmarket_user -p -h localhost greenmarket_prod

# Check MySQL listening on port 3306
sudo netstat -tuln | grep 3306
```

**Solutions:**

1. **Start MySQL if stopped:**
   ```bash
   sudo systemctl start mysqld
   sudo systemctl enable mysqld
   ```

2. **Verify credentials in .env:**
   ```bash
   sudo cat /etc/greenmarket/.env | grep DB_
   ```

3. **Test credentials manually:**
   ```bash
   PASS=$(grep DB_PASSWORD /etc/greenmarket/.env | cut -d '=' -f 2)
   USER=$(grep DB_USER /etc/greenmarket/.env | cut -d '=' -f 2)
   HOST=$(grep DB_HOST /etc/greenmarket/.env | cut -d '=' -f 2)
   mysql -u $USER -p$PASS -h $HOST
   ```

4. **Check if MySQL user exists:**
   ```bash
   sudo mysql -u root -p
   SELECT User, Host FROM mysql.user;
   ```

5. **Recreate user if needed:**
   ```bash
   sudo mysql -u root -p
   CREATE USER 'greenmarket_user'@'localhost' IDENTIFIED BY 'new_password';
   GRANT ALL PRIVILEGES ON greenmarket_prod.* TO 'greenmarket_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Database Migrations Fail

**Symptoms:**
- Migration errors during deployment
- Schema mismatch errors
- Tables missing

**Diagnosis:**
```bash
# Check migration status
cd /opt/greenmarket/greenmarket-backend
npm run migrate --verbose

# Check if migrations table exists
mysql -u greenmarket_user -p greenmarket_prod -e "SHOW TABLES LIKE '%sequelizemeta%';"
```

**Solutions:**

1. **Run migrations manually:**
   ```bash
   cd /opt/greenmarket/greenmarket-backend
   npx sequelize-cli db:migrate
   ```

2. **Undo migrations if needed:**
   ```bash
   npx sequelize-cli db:migrate:undo:all
   npx sequelize-cli db:migrate
   ```

3. **Check migrations directory:**
   ```bash
   ls -la ./migrations/
   ```

### Database Disk Space Full

**Symptoms:**
- Database write errors
- "Disk full" errors
- Queries slowing down

**Diagnosis:**
```bash
# Check disk usage
df -h /

# Check MySQL data directory
du -sh /var/lib/mysql

# Check table sizes
mysql -u root -p
SELECT table_schema, ROUND(SUM(data_length+index_length)/1024/1024, 2) AS size_mb FROM information_schema.tables GROUP BY table_schema;
```

**Solutions:**

1. **Clean up old data:**
   ```bash
   # Remove old logs
   sudo truncate -s 0 /var/log/mysql*.log
   
   # Run MySQL maintenance
   sudo mysqlcheck -u root -p --optimize --all-databases
   ```

2. **Add more disk space:**
   - Contact system administrator
   - Archive old data to backup

---

## Nginx/Web Server Issues

### Nginx Not Starting

**Symptoms:**
- `sudo systemctl status nginx` shows failed
- Port 80/443 not listening
- "Connection refused" when accessing site

**Diagnosis:**
```bash
# Check status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check if port is in use
sudo lsof -i :80
sudo lsof -i :443

# View error log
sudo tail -f /var/log/nginx/error.log
```

**Solutions:**

1. **Syntax error in config:**
   ```bash
   sudo nginx -t
   ```
   - Fix any reported errors in `/etc/nginx/conf.d/greenmarket.conf`

2. **Port already in use:**
   ```bash
   # Find and kill process on port 80
   sudo lsof -i :80
   sudo kill -9 <PID>
   ```

3. **Start Nginx:**
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

4. **Check permissions:**
   ```bash
   sudo nginx -t -c /etc/nginx/nginx.conf
   ```

### 502 Bad Gateway Error

**Symptoms:**
- "502 Bad Gateway" in browser
- Backend not responding through Nginx
- Direct backend access works but proxied doesn't

**Diagnosis:**
```bash
# Check if backend is running
pm2 status

# Check backend is listening on 5000
sudo lsof -i :5000
curl http://localhost:5000

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

**Solutions:**

1. **Verify backend is running:**
   ```bash
   pm2 status
   pm2 start greenmarket-api  # If stopped
   ```

2. **Test backend directly:**
   ```bash
   curl -v http://localhost:5000
   ```

3. **Check Nginx upstream config:**
   ```bash
   grep -A 5 "upstream greenmarket_api" /etc/nginx/conf.d/greenmarket.conf
   ```

4. **Increase proxy timeout:**
   ```bash
   # Edit config
   sudo nano /etc/nginx/conf.d/greenmarket.conf
   
   # Add timeouts:
   proxy_connect_timeout 60s;
   proxy_send_timeout 60s;
   proxy_read_timeout 60s;
   
   # Restart
   sudo systemctl restart nginx
   ```

### Static Files Not Loading

**Symptoms:**
- Frontend loads but CSS/JS missing
- Images not loading
- 404 errors for static files

**Diagnosis:**
```bash
# Check if frontend is built
ls -la /opt/greenmarket/greenmarket-frontend/dist/

# Test direct access
curl http://localhost:80/index.html

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
```

**Solutions:**

1. **Rebuild frontend:**
   ```bash
   cd /opt/greenmarket/greenmarket-frontend
   npm run build
   ```

2. **Check Nginx location directive:**
   ```bash
   sudo grep -A 5 "location /" /etc/nginx/conf.d/greenmarket.conf
   ```
   Should point to: `root /opt/greenmarket/greenmarket-frontend/dist;`

3. **Set correct permissions:**
   ```bash
   sudo chown -R nginx:nginx /opt/greenmarket/greenmarket-frontend/dist
   sudo chmod -R 755 /opt/greenmarket/greenmarket-frontend/dist
   ```

4. **Verify try_files directive:**
   ```bash
   # Should have: try_files $uri $uri/ /index.html;
   ```

---

## SSL/Certificate Issues

### SSL Certificate Not Found

**Symptoms:**
- "The certificate authority could not be contacted"
- SSL errors in browser
- Certificate warnings

**Diagnosis:**
```bash
# Check certificates
sudo certbot certificates

# Check if cert file exists
ls -la /etc/letsencrypt/live/umc-green-project-prd-app-01.oit.umn.edu/

# Test SSL
openssl s_client -connect localhost:443
```

**Solutions:**

1. **Generate certificate:**
   ```bash
   sudo certbot --nginx -d umc-green-project-prd-app-01.oit.umn.edu
   ```

2. **Check if already installed:**
   ```bash
   sudo certbot certificates
   ```

3. **Renew if expired:**
   ```bash
   sudo certbot renew --force-renewal
   ```

### Certificate Auto-Renewal Not Working

**Symptoms:**
- Certificate expired
- Renewal not automatically triggered
- Manual renewal required

**Diagnosis:**
```bash
# Check certbot timer
sudo systemctl status certbot.timer

# Check renewal logs
sudo tail -f /var/log/letsencrypt/renew.log

# Test renewal
sudo certbot renew --dry-run
```

**Solutions:**

1. **Enable auto-renewal:**
   ```bash
   sudo systemctl enable certbot.timer
   sudo systemctl start certbot.timer
   ```

2. **Test renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

3. **Force renewal if needed:**
   ```bash
   sudo certbot renew --force-renewal
   ```

4. **Check renewal hook:**
   ```bash
   # Verify Nginx reload after renewal
   sudo grep -A 5 "deploy-hook" /etc/letsencrypt/renewal/
   ```

---

## Deployment Issues

### Deploy Script Fails

**Symptoms:**
- Deployment script stops with errors
- Partial deployment state
- Services not running

**Diagnosis:**
```bash
# Run with verbose output
bash scripts/deploy.sh -v

# Check specific steps:
cd /opt/greenmarket/greenmarket-backend
npm install --production
npm run migrate
```

**Solutions:**

1. **Check environment file:**
   ```bash
   sudo cat /etc/greenmarket/.env
   ```

2. **Verify directory permissions:**
   ```bash
   ls -la /opt/greenmarket/
   ls -la /etc/greenmarket/
   ```

3. **Run deployment again:**
   ```bash
   bash scripts/deploy.sh
   ```

### Git Pull Fails

**Symptoms:**
- "Permission denied" errors
- "Network is unreachable"
- Merge conflicts

**Diagnosis:**
```bash
# Check git status
cd /opt/greenmarket
git status

# Check remote
git remote -v

# Test connectivity
git fetch --dry-run
```

**Solutions:**

1. **Fix permissions:**
   ```bash
   sudo chown -R $USER:$USER /opt/greenmarket/.git
   chmod -R 755 /opt/greenmarket/.git
   ```

2. **Resolve conflicts:**
   ```bash
   git pull --no-edit --rebase
   ```

3. **Force pull if needed:**
   ```bash
   git fetch origin main
   git reset --hard origin/main
   ```

---

## Performance Issues

### High CPU Usage

**Symptoms:**
- CPU at 100%
- System slow
- High load average

**Diagnosis:**
```bash
# Monitor processes
top -b -n 1 | head -20

# Check Node process
ps aux | grep node

# Monitor system
vmstat 1 10
```

**Solutions:**

1. **Identify bottleneck:**
   ```bash
   # Check database queries
   pm2 logs greenmarket-api | grep "Query took"
   
   # Check API response times
   pm2 logs greenmarket-api | grep "ms"
   ```

2. **Optimize slow queries:**
   - Run [SKILL: mongodb-query-optimizer](../skills/mongodb-query-optimizer/) if using MongoDB
   - Or check MySQL slow query log

3. **Increase server resources:**
   - Upgrade server if at capacity

### High Memory Usage

**Symptoms:**
- Out of memory errors
- Process crashes
- Swap usage high

**Diagnosis:**
```bash
# Check memory
free -h

# Monitor Node process
ps aux | grep node | awk '{print $6}'

# Real-time monitoring
top
```

**Solutions:**

1. **Restart backend to clear cache:**
   ```bash
   pm2 restart greenmarket-api
   ```

2. **Check for memory leaks:**
   ```bash
   pm2 logs greenmarket-api | grep -i "memory\|leak\|gc"
   ```

3. **Reduce database connection pool:**
   ```bash
   # Edit config/database.js
   # Reduce pool size if too high
   ```

---

## Security Issues

### Unauthorized Access Attempts

**Symptoms:**
- Suspicious login attempts in logs
- Brute force attacks
- Unauthorized API calls

**Diagnosis:**
```bash
# Check access logs
sudo grep "401\|403" /var/log/nginx/access.log

# Check failed logins
grep "failed\|error" /opt/greenmarket/greenmarket-backend/logs/*
```

**Solutions:**

1. **Implement rate limiting:**
   - Already configured in Express backend
   - Verify in server.js

2. **Update Nginx rate limiting:**
   ```bash
   sudo nano /etc/nginx/conf.d/greenmarket.conf
   
   # Add:
   limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
   limit_req zone=api_limit burst=20;
   ```

3. **Monitor logs regularly:**
   ```bash
   sudo tail -f /var/log/nginx/access.log | grep 401
   ```

### SQL Injection Vulnerability

**Symptoms:**
- Suspicious SQL in logs
- Quote marks in queries
- Unusual characters in requests

**Diagnosis:**
```bash
# Check API logs
pm2 logs greenmarket-api | grep "query\|sql"

# Monitor Nginx logs
sudo grep "union\|select\|insert" /var/log/nginx/access.log
```

**Solutions:**

1. **Verify input validation:**
   - Check routes/auth.js for validation
   - Ensure express-validator is used

2. **Use parameterized queries:**
   - Sequelize ORM prevents SQL injection
   - Never concatenate SQL strings

3. **Regular security audits:**
   ```bash
   npm audit
   npm audit fix
   ```

---

## Quick Reference: Common Commands

```bash
# Backend
pm2 status                              # Check process status
pm2 logs greenmarket-api -f             # View live logs
pm2 restart greenmarket-api             # Restart backend
pm2 stop greenmarket-api                # Stop backend
pm2 start greenmarket-api               # Start backend

# Nginx
sudo systemctl status nginx              # Check Nginx status
sudo systemctl restart nginx             # Restart Nginx
sudo nginx -t                            # Test Nginx config
sudo tail -f /var/log/nginx/error.log   # View Nginx errors

# Database
mysql -u greenmarket_user -p greenmarket_prod  # Connect to DB
SHOW TABLES;                             # List tables
SELECT * FROM users;                     # Query users

# System
df -h                                    # Disk usage
free -h                                  # Memory usage
top                                      # Process monitor
sudo systemctl restart mysqld            # Restart MySQL

# Deployment
cd /opt/greenmarket
bash scripts/deploy.sh                   # Full deployment
bash scripts/maintenance.sh              # Maintenance menu
git pull origin main                     # Update code
```

---

## Getting Help

If issues persist:

1. **Check logs first:**
   ```bash
   pm2 logs greenmarket-api
   sudo tail -f /var/log/nginx/error.log
   sudo journalctl -xe
   ```

2. **Collect diagnostics:**
   ```bash
   pm2 status
   df -h
   free -h
   systemctl status mysqld
   systemctl status nginx
   ```

3. **Contact support with:**
   - Error messages from logs
   - Steps to reproduce
   - System diagnostics output
   - Recent changes made

---

**Document Version**: 1.0
**Last Updated**: 2026-04-22
