#!/bin/bash

# ==============================================
# PREPARE DEPLOYMENT - Local Script
# ==============================================
# Exécuter ce script en LOCAL avant le déploiement
# Il commit les changements et les push
# ==============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  Prepare Deployment - Local${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Vérifier si on est sur la bonne branche
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Current branch: ${CURRENT_BRANCH}${NC}"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}Warning: Not on main branch${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}[1/4] Checking git status...${NC}"
git status --short

echo ""
echo -e "${YELLOW}[2/4] Adding changes...${NC}"
git add prisma/schema.prisma
git add .zscripts/deploy-blog-fix.sh
git add .zscripts/prepare-deploy.sh

echo ""
echo -e "${YELLOW}[3/4] Committing changes...${NC}"
git commit -m "fix: add Post model to Prisma schema and deployment scripts

- Add Post model for blog functionality
- Add posts relation to User model
- Create deployment scripts for blog fix
- Enable blog articles with 20 pre-seeded posts

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"

echo ""
echo -e "${YELLOW}[4/4] Pushing to remote...${NC}"
git push origin main

echo ""
echo -e "${GREEN}✓ Changes pushed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Connect to server: ssh root@213.199.38.41"
echo "  2. Run: bash .zscripts/deploy-blog-fix.sh"
echo ""
