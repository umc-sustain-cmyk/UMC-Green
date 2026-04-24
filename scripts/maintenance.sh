#!/bin/bash
# GreenMarket Maintenance & Monitoring Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Menu-driven script
show_menu() {
    echo ""
    echo "=========================================="
    echo "GreenMarket Maintenance Menu"
    echo "=========================================="
    echo "1. View Backend Status"
    echo "2. View Backend Logs (live)"
    echo "3. Restart Backend"
    echo "4. Stop Backend"
    echo "5. Start Backend"
    echo "6. View Nginx Status"
    echo "7. View Nginx Access Logs"
    echo "8. View Nginx Error Logs"
    echo "9. Check Database Connection"
    echo "10. View System Resources"
    echo "11. Restart All Services"
    echo "12. Backup Database"
    echo "13. View Disk Usage"
    echo "14. Update Application (git pull)"
    echo "15. View SSL Certificate Info"
    echo "16. Redeploy Application"
    echo "0. Exit"
    echo "=========================================="
}

backend_status() {
    print_info "Backend Process Status:"
    pm2 status
    echo ""
    pm2 describe greenmarket-api 2>/dev/null || print_warning "Process not found"
}

backend_logs() {
    print_info "Showing backend logs (Press Ctrl+C to exit)..."
    pm2 logs greenmarket-api -f
}

restart_backend() {
    print_info "Restarting backend..."
    pm2 restart greenmarket-api
    print_status "Backend restarted"
}

stop_backend() {
    print_info "Stopping backend..."
    pm2 stop greenmarket-api
    print_status "Backend stopped"
}

start_backend() {
    print_info "Starting backend..."
    export $(cat /etc/greenmarket/.env | xargs)
    cd /opt/greenmarket/greenmarket-backend
    pm2 start server.js --name "greenmarket-api" --env /etc/greenmarket/.env
    print_status "Backend started"
}

nginx_status() {
    print_info "Nginx Status:"
    sudo systemctl status nginx
}

nginx_access_logs() {
    print_info "Nginx Access Logs (last 100 lines):"
    sudo tail -f /var/log/nginx/access.log | head -100
}

nginx_error_logs() {
    print_info "Nginx Error Logs (last 100 lines):"
    sudo tail -f /var/log/nginx/error.log | head -100
}

check_db() {
    print_info "Checking Database Connection..."
    
    # Read environment variables
    DB_HOST=$(grep DB_HOST /etc/greenmarket/.env | cut -d '=' -f 2)
    DB_USER=$(grep DB_USER /etc/greenmarket/.env | cut -d '=' -f 2)
    DB_NAME=$(grep DB_NAME /etc/greenmarket/.env | cut -d '=' -f 2)
    
    mysql -u $DB_USER -p$(grep DB_PASSWORD /etc/greenmarket/.env | cut -d '=' -f 2) -h $DB_HOST -e "SELECT 'Database connection successful' as status; SELECT COUNT(*) as user_count FROM users; SELECT COUNT(*) as item_count FROM items;" $DB_NAME 2>&1 || print_error "Database connection failed"
}

system_resources() {
    echo ""
    print_info "System Resource Usage:"
    echo ""
    print_info "CPU & Memory:"
    free -h
    echo ""
    print_info "Disk Usage:"
    df -h
    echo ""
    print_info "Top Processes:"
    ps aux --sort=-%mem | head -6
}

restart_all() {
    print_warning "This will restart all services. Are you sure? (y/n)"
    read -r confirm
    if [[ $confirm == "y" ]]; then
        print_info "Restarting all services..."
        sudo systemctl restart mysqld
        print_status "MySQL restarted"
        
        pm2 restart greenmarket-api
        print_status "Backend restarted"
        
        sudo systemctl restart nginx
        print_status "Nginx restarted"
        
        print_status "All services restarted"
    else
        print_warning "Restart cancelled"
    fi
}

backup_database() {
    print_info "Backing up database..."
    
    BACKUP_DIR="/opt/greenmarket/backups"
    mkdir -p $BACKUP_DIR
    
    DB_NAME=$(grep DB_NAME /etc/greenmarket/.env | cut -d '=' -f 2)
    DB_USER=$(grep DB_USER /etc/greenmarket/.env | cut -d '=' -f 2)
    DB_HOST=$(grep DB_HOST /etc/greenmarket/.env | cut -d '=' -f 2)
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"
    
    mysqldump -u $DB_USER -p$(grep DB_PASSWORD /etc/greenmarket/.env | cut -d '=' -f 2) -h $DB_HOST $DB_NAME > $BACKUP_FILE
    
    print_status "Database backed up to: $BACKUP_FILE"
    print_info "Backup size: $(du -h $BACKUP_FILE | cut -f 1)"
}

disk_usage() {
    print_info "Disk Usage Analysis:"
    echo ""
    du -sh /opt/greenmarket/* 2>/dev/null
    echo ""
    print_info "Total disk usage:"
    df -h /
}

update_app() {
    print_warning "This will pull latest code. Are you sure? (y/n)"
    read -r confirm
    if [[ $confirm == "y" ]]; then
        cd /opt/greenmarket
        print_info "Pulling latest code..."
        git pull origin main
        print_status "Code updated"
    else
        print_warning "Update cancelled"
    fi
}

ssl_info() {
    print_info "SSL Certificate Information:"
    sudo certbot certificates
    echo ""
    print_info "Certificate Renewal Check:"
    sudo certbot renew --dry-run
}

redeploy_app() {
    print_warning "This will redeploy the entire application. Are you sure? (y/n)"
    read -r confirm
    if [[ $confirm == "y" ]]; then
        cd /opt/greenmarket
        bash scripts/deploy.sh
    else
        print_warning "Redeploy cancelled"
    fi
}

# Main script loop
while true; do
    show_menu
    read -p "Select an option (0-16): " choice
    
    case $choice in
        1) backend_status ;;
        2) backend_logs ;;
        3) restart_backend ;;
        4) stop_backend ;;
        5) start_backend ;;
        6) nginx_status ;;
        7) nginx_access_logs ;;
        8) nginx_error_logs ;;
        9) check_db ;;
        10) system_resources ;;
        11) restart_all ;;
        12) backup_database ;;
        13) disk_usage ;;
        14) update_app ;;
        15) ssl_info ;;
        16) redeploy_app ;;
        0) 
            print_info "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option. Please try again."
            ;;
    esac
    
    read -p "Press Enter to continue..."
done
