#!/bin/bash

# ==============================================
# DEPLOYMENT SCRIPT - RunWeek Blog Fix
# ==============================================
# Ce script déploie les corrections du blog
# sur le serveur de production
# ==============================================

set -e  # Arrêter en cas d'erreur

# Couleurs pour le output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/html/runweekv3"
PM2_APP_NAME="runweekv3"
BACKUP_DIR="/var/www/html/backups/runweekv3-$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  RunWeek - Blog Deployment Script${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# ==============================================
# 1. BACKUP
# ==============================================
echo -e "${YELLOW}[1/7] Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
cp -r "$PROJECT_DIR/.next" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$PROJECT_DIR/node_modules/.prisma" "$BACKUP_DIR/" 2>/dev/null || true
echo -e "${GREEN}✓ Backup created: $BACKUP_DIR${NC}"
echo ""

# ==============================================
# 2. PULL LATEST CODE
# ==============================================
echo -e "${YELLOW}[2/7] Pulling latest code...${NC}"
cd "$PROJECT_DIR"
git fetch origin
git pull origin main
echo -e "${GREEN}✓ Code updated${NC}"
echo ""

# ==============================================
# 3. INSTALL DEPENDENCIES
# ==============================================
echo -e "${YELLOW}[3/7] Installing dependencies...${NC}"
npm install --production=false
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# ==============================================
# 4. PRISMA MIGRATIONS
# ==============================================
echo -e "${YELLOW}[4/7] Running Prisma migrations...${NC}"
npx prisma migrate deploy
echo -e "${GREEN}✓ Migrations applied${NC}"
echo ""

# ==============================================
# 5. REGENERATE PRISMA CLIENT
# ==============================================
echo -e "${YELLOW}[5/7] Regenerating Prisma client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma client generated${NC}"
echo ""

# ==============================================
# 6. SEED BLOG ARTICLES
# ==============================================
echo -e "${YELLOW}[6/7] Seeding blog articles...${NC}"
node prisma/seed-articles.ts
echo -e "${GREEN}✓ Articles seeded${NC}"
echo ""

# ==============================================
# 7. BUILD AND RESTART
# ==============================================
echo -e "${YELLOW}[7/7] Building and restarting application...${NC}"
npm run build
pm2 restart "$PM2_APP_NAME" || pm2 start npm --name "$PM2_APP_NAME" -- start
echo -e "${GREEN}✓ Application restarted${NC}"
echo ""

# ==============================================
# SUMMARY
# ==============================================
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}  ✓ Deployment completed successfully!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo "Blog articles available at:"
echo "  - https://runweek.fr/blog"
echo ""
echo "PM2 Status:"
pm2 status "$PM2_APP_NAME"
echo ""
echo "Recent logs:"
pm2 logs "$PM2_APP_NAME" --lines 20 --nostream
