#!/bin/bash
# Script de déploiement pour Crea Entreprise
# Domaine : offrespro.fr
# Base de données : PostgreSQL

set -e

echo "🚀 Déploiement de Crea Entreprise sur offrespro.fr"

# Configuration
PROJECT_NAME="crea-entreprise"
DOMAIN="offrespro.fr"
DB_URL="postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours"
TAR_FILE="/root/a_deployer/crea-entreprise-1.tar"
DEPLOY_DIR="/var/www/$PROJECT_NAME"

# Vérifier si le fichier tar existe
if [ ! -f "$TAR_FILE" ]; then
    echo "❌ Erreur: Le fichier $TAR_FILE n'existe pas"
    exit 1
fi

echo "📦 Extraction du fichier tar..."
mkdir -p "$DEPLOY_DIR"
tar -xf "$TAR_FILE" -C "$DEPLOY_DIR"

cd "$DEPLOY_DIR"
echo "📂 Répertoire de déploiement: $DEPLOY_DIR"

# Vérifier la structure du projet
echo "📋 Structure du projet:"
ls -la

# Créer le fichier .env si nécessaire
if [ ! -f .env ]; then
    echo "🔧 Création du fichier .env..."
    cat > .env << EOF
DATABASE_URL=$DB_URL
DOMAIN=$DOMAIN
PROJECT_NAME=$PROJECT_NAME
NODE_ENV=production
EOF
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Installation..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Installation..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Arrêter les conteneurs existants si présents
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down 2>/dev/null || true

# Construire et démarrer les conteneurs
echo "🏗️ Construction et démarrage des conteneurs Docker..."
docker-compose up -d --build

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Exécuter les migrations si nécessaire
echo "🗄️ Exécution des migrations de base de données..."
if [ -f package.json ]; then
    if grep -q "prisma" package.json; then
        docker-compose exec -T app npx prisma migrate deploy
    elif grep -q "typeorm" package.json; then
        docker-compose exec -T app npm run migration:run
    fi
fi

echo "✅ Déploiement terminé avec succès !"
echo "🌐 Votre site devrait être accessible sur: http://$DOMAIN"
echo ""
echo "📊 Commandes utiles:"
echo "  - Voir les logs: docker-compose logs -f"
echo "  - Arrêter: docker-compose down"
echo "  - Redémarrer: docker-compose restart"
