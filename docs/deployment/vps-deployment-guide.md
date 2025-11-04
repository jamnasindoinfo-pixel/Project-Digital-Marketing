# VPS Deployment Guide

This guide covers deployment of the PT Jaminan Solusi Bisnis website on a VPS with Niagahoster.

## Prerequisites

- VPS from Niagahoster (recommended: Silver Package or higher)
- Domain name
- Basic Linux command line knowledge
- SSH client

## Step 1: VPS Setup

### 1.1 Purchase and Configure VPS

1. Login to Niagahoster account
2. Purchase VPS (Silver or Gold recommended)
3. Choose Ubuntu 22.04 LTS as OS
4. Note down:
   - IP address
   - SSH credentials
   - Control panel access

### 1.2 Initial Server Setup

Connect to your VPS via SSH:

```bash
ssh root@your_vps_ip
```

Update the system:

```bash
apt update && apt upgrade -y
```

Install required software:

```bash
apt install -y curl wget git unzip htop nginx certbot python3-certbot-nginx
```

## Step 2: Node.js Installation

Install Node.js 18.x (LTS):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

Verify installation:

```bash
node --version  # Should be v18.x.x
npm --version   # Should be 9.x.x or higher
```

## Step 3: Install PM2 Process Manager

```bash
npm install -g pm2
```

## Step 4: Application Setup

### 4.1 Create Application User

```bash
adduser nodeapp
usermod -aG sudo nodeapp
su - nodeapp
```

### 4.2 Clone and Build Application

```bash
# Clone your repository (replace with your Git URL)
git clone https://github.com/yourusername/pt-jaminan-solusi-bisnis.git
cd pt-jaminan-solusi-bisnis

# Install dependencies
npm install

# Build the application
npm run build
```

### 4.3 Configure Environment Variables

Create `.env.local`:

```bash
nano .env.local
```

Add your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret

# Production settings
NODE_ENV=production
```

## Step 5: Configure PM2

Create PM2 ecosystem file:

```bash
nano ecosystem.config.js
```

Add the following configuration:

```javascript
module.exports = {
  apps: [{
    name: 'jaminan-solusi-app',
    script: 'npm',
    args: 'start',
    cwd: '/home/nodeapp/pt-jaminan-solusi-bisnis',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

Create logs directory:

```bash
mkdir -p logs
```

Start the application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Nginx Configuration

### 6.1 Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/jaminan-solusi
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificate (will be configured by Certbot)

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Proxy to Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
```

### 6.2 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/jaminan-solusi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: SSL Certificate Setup

### 7.1 Install SSL with Certbot

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts to:
- Enter email address
- Agree to terms
- Choose to redirect HTTP to HTTPS

### 7.2 Auto-renewal Setup

```bash
sudo crontab -e
```

Add this line:

```
0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 8: Domain Configuration

### 8.1 DNS Settings

In your domain registrar dashboard, configure:

```
A Record: @ -> your_vps_ip
A Record: www -> your_vps_ip
```

### 8.2 Wait for Propagation

DNS changes may take 15-30 minutes to propagate worldwide.

## Step 9: Monitoring and Maintenance

### 9.1 PM2 Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart jaminan-solusi-app

# Monitor performance
pm2 monit
```

### 9.2 Set up Log Rotation

```bash
sudo nano /etc/logrotate.d/nodeapp
```

Add:

```
/home/nodeapp/pt-jaminan-solusi-bisnis/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nodeapp nodeapp
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Step 10: Security Hardening

### 10.1 Firewall Setup

```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

### 10.2 Fail2Ban Setup

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Step 11: Backup Strategy

### 11.1 Database Backup (Supabase)

- Supabase handles database backups automatically
- Enable point-in-time recovery in Supabase dashboard
- Export regular SQL backups locally

### 11.2 Application Backup

Create backup script:

```bash
nano backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/nodeapp/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/nodeapp/pt-jaminan-solusi-bisnis"

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

# Backup PM2 configuration
pm2 save > $BACKUP_DIR/pm2_$DATE.json

# Keep last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make it executable:

```bash
chmod +x backup.sh
crontab -e
```

Add daily backup:

```
0 2 * * * /home/nodeapp/backup.sh
```

## Troubleshooting

### Common Issues:

1. **502 Bad Gateway**: Check if PM2 is running: `pm2 status`
2. **SSL Issues**: Check Nginx config: `sudo nginx -t`
3. **High Memory Usage**: Check PM2 logs for memory leaks
4. **Slow Performance**: Enable Nginx caching and CDN

### Useful Commands:

```bash
# Check system resources
htop
df -h
free -h

# Check Nginx status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Check PM2 logs
pm2 logs --lines 100
```

## Performance Optimization

### 1. Enable Nginx Caching

Add to Nginx config:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Enable CDN

- Consider CloudFlare for CDN and DDoS protection
- Configure CloudFlare to cache static assets

### 3. Database Optimization

- Use Supabase's connection pooling
- Enable query caching
- Monitor query performance

## Next Steps

1. Set up monitoring (UptimeRobot, Pingdom)
2. Configure error reporting (Sentry)
3. Set up automated testing
4. Configure backup monitoring
5. Plan for scaling strategy