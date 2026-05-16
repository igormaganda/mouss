#!/bin/bash
# Script pour obtenir le certificat SSL Let's Encrypt
# À exécuter une fois le DNS configuré (offrespro.fr → 213.199.38.41)

set -e

echo "🔒 Configuration SSL pour Crea Entreprise"
echo "=========================================="
echo ""
echo "⚠️  PRÉ-REQUIS :"
echo "   - Le DNS doit pointer vers 213.199.38.41"
echo "   - Vérifier avec : nslookup offrespro.fr"
echo ""
echo "🔍 Vérification du DNS..."

# Vérifier le DNS
if nslookup offrespro.fr | grep -q "213.199.38.41"; then
    echo "✅ DNS correctement configuré"
else
    echo "❌ DNS ne pointe pas encore vers 213.199.38.41"
    echo "   Veuillez d'abord configurer le DNS chez votre registraire"
    exit 1
fi

echo ""
echo "🚀 Obtention du certificat SSL..."

# Obtenir le certificat SSL
certbot certonly --webroot -w /var/www/html \
    -d offrespro.fr \
    -d www.offrespro.fr \
    --email admin@offrespro.fr \
    --agree-tos \
    --no-eff-email \
    --force-renewal

echo ""
echo "🔧 Configuration nginx avec SSL..."

# Appliquer la configuration SSL
cat > /etc/nginx/sites-available/crea-entreprise << 'EOF'
# Configuration HTTP (redirect vers HTTPS)
server {
    listen 80;
    server_name offrespro.fr www.offrespro.fr;

    # Pour Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect tout le trafic vers HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# Configuration HTTPS
server {
    listen 443 ssl http2;
    server_name offrespro.fr www.offrespro.fr;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/offrespro.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/offrespro.fr/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy vers Next.js
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

    # Logs
    access_log /var/log/nginx/crea-entreprise-access.log;
    error_log /var/log/nginx/crea-entreprise-error.log;
}
EOF

# Tester et recharger nginx
nginx -t && systemctl reload nginx

echo ""
echo "✅ SSL configuré avec succès !"
echo ""
echo "🌐 Votre site est maintenant accessible en HTTPS :"
echo "   - https://offrespro.fr"
echo "   - https://www.offrespro.fr"
echo ""
echo "🔄 Le renouvellement automatique est configuré via systemd timer"
echo "   Vérifier : systemctl status certbot.timer"
echo ""
echo "🔍 Vérifier la configuration SSL :"
echo "   curl -I https://offrespro.fr"
