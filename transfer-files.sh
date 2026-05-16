#!/bin/bash
# Script de transfert des fichiers vers le serveur

set -e

SERVER="root@213.199.38.41"
REMOTE_DIR="/root/a_deployer"

echo "📤 Transfert des fichiers vers le serveur..."

# Créer le répertoire distant
ssh "$SERVER" "mkdir -p $REMOTE_DIR"

# Transférer les fichiers
echo "📦 Transfert de deploy-crea-entreprise.sh..."
scp deploy-crea-entreprise.sh "$SERVER:$REMOTE_DIR/"

echo "📦 Transfert de docker-compose.yml..."
scp docker-compose.yml "$SERVER:$REMOTE_DIR/"

echo "📦 Transfert de nginx.conf..."
scp nginx.conf "$SERVER:$REMOTE_DIR/"

echo "📦 Transfert de create-table.sql..."
scp create-table.sql "$SERVER:$REMOTE_DIR/"

echo "📦 Transfert de setup-database.sh..."
scp setup-database.sh "$SERVER:$REMOTE_DIR/"

echo "📦 Transfert de README-DEPLOY.md..."
scp README-DEPLOY.md "$SERVER:$REMOTE_DIR/"

echo "📦 Transfert de QUICKSTART.md..."
scp QUICKSTART.md "$SERVER:$REMOTE_DIR/"

echo "✅ Tous les fichiers ont été transférés avec succès !"
echo ""
echo "🔗 Prochaine étape : Connectez-vous au serveur avec :"
echo "   ssh $SERVER"
echo ""
echo "Puis exécutez :"
echo "   cd $REMOTE_DIR"
echo "   chmod +x setup-database.sh deploy-crea-entreprise.sh"
echo "   ./setup-database.sh"
echo "   ./deploy-crea-entreprise.sh"
