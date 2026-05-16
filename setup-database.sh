#!/bin/bash
# Script pour créer les tables sur PostgreSQL

set -e

echo "🗄️ Création des tables PostgreSQL pour Crea Entreprise"

# Configuration
DB_URL="postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours"
SQL_FILE="/root/create-table.sql"

# Vérifier si le fichier SQL existe
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Erreur: Le fichier $SQL_FILE n'existe pas"
    echo "Veuillez d'abord transférer le fichier create-table.sql"
    exit 1
fi

# Installer le client PostgreSQL si nécessaire
if ! command -v psql &> /dev/null; then
    echo "📦 Installation du client PostgreSQL..."
    apt update
    apt install -y postgresql-client
fi

# Exécuter le script SQL
echo "🚀 Exécution du script de création des tables..."
psql "$DB_URL" -f "$SQL_FILE"

echo "✅ Tables créées avec succès !"
echo ""
echo "📊 Pour vérifier les tables créées :"
echo "  psql \"$DB_URL\" -c '\dt'"
