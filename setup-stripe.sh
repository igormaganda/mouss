#!/bin/bash
# Script pour configurer les clés Stripe
# À exécuter une fois que vous avez vos clés Stripe

set -e

echo "💳 Configuration Stripe pour Crea Entreprise"
echo "=============================================="
echo ""
echo "⚠️  INFORMATIONS REQUISES :"
echo "   Vous devez avoir un compte Stripe avec les clés suivantes :"
echo "   - Stripe Secret Key (sk_test_... ou sk_live_...)"
echo "   - Stripe Publishable Key (pk_test_... ou pk_live_...)"
echo "   - Stripe Webhook Secret (whsec_...)"
echo ""
echo "   Obtenir ces clés : https://dashboard.stripe.com/apikeys"
echo ""

# Demander les clés
read -p "Entrez votre Stripe Secret Key (sk_test_... ou sk_live_...) : " STRIPE_SECRET_KEY
read -p "Entrez votre Stripe Publishable Key (pk_test_... ou pk_live_...) : " STRIPE_PUBLISHABLE_KEY
read -p "Entrez votre Stripe Webhook Secret (whsec_...) [OPTIONNEL] : " STRIPE_WEBHOOK_SECRET

# Validation basique
if [[ ! $STRIPE_SECRET_KEY =~ ^sk_(test|live)_ ]]; then
    echo "❌ Stripe Secret Key invalide (doit commencer par sk_test_ ou sk_live_)"
    exit 1
fi

if [[ ! $STRIPE_PUBLISHABLE_KEY =~ ^pk_(test|live)_ ]]; then
    echo "❌ Stripe Publishable Key invalide (doit commencer par pk_test_ ou pk_live_)"
    exit 1
fi

echo ""
echo "🔧 Mise à jour de la configuration..."

# Répertoire de l'application
APP_DIR="/var/www/crea-entreprise"

# Créer une sauvegarde du fichier .env existant
if [ -f "$APP_DIR/.env.production" ]; then
    cp "$APP_DIR/.env.production" "$APP_DIR/.env.production.backup"
    echo "✅ Sauvegarde créée : .env.production.backup"
fi

# Mettre à jour les variables Stripe dans .env.production
if grep -q "STRIPE_SECRET_KEY" "$APP_DIR/.env.production"; then
    sed -i "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY|" "$APP_DIR/.env.production"
else
    echo "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY" >> "$APP_DIR/.env.production"
fi

if grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "$APP_DIR/.env.production"; then
    sed -i "s|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY|" "$APP_DIR/.env.production"
else
    echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY" >> "$APP_DIR/.env.production"
fi

if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
    if grep -q "STRIPE_WEBHOOK_SECRET" "$APP_DIR/.env.production"; then
        sed -i "s|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET|" "$APP_DIR/.env.production"
    else
        echo "STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET" >> "$APP_DIR/.env.production"
    fi
fi

echo "✅ Configuration Stripe mise à jour"

# Afficher la configuration actuelle
echo ""
echo "📋 Configuration actuelle :"
echo "────────────────────────────"
grep -E "STRIPE_|NEXT_PUBLIC_STRIPE_" "$APP_DIR/.env.production" | sed 's/=.*/=***/'
echo "────────────────────────────"

echo ""
echo "🔄 Redémarrage de l'application..."

# Redémarrer le service pour appliquer les changements
systemctl restart crea-entreprise.service

# Attendre que le service démarre
sleep 5

# Vérifier le statut
if systemctl is-active --quiet crea-entreprise.service; then
    echo "✅ Application redémarrée avec succès"
else
    echo "❌ Problème lors du redémarrage de l'application"
    echo "   Vérifier les logs : journalctl -u crea-entreprise.service -f"
    exit 1
fi

echo ""
echo "🎉 Configuration Stripe terminée !"
echo ""
echo "📝 Prochaine étape :"
echo "   - Configurez le webhook Stripe : https://dashboard.stripe.com/webhooks"
echo "   - URL du webhook : https://offrespro.fr/api/webhooks/stripe"
echo "   - Événements à écouter :"
echo "     • checkout.session.completed"
echo "     • customer.subscription.created"
echo "     • customer.subscription.updated"
echo "     • customer.subscription.deleted"
echo ""
echo "🔍 Tester la configuration :"
echo "   - Créez un produit de test dans Stripe"
echo "   - Testez le processus de paiement"
echo "   - Vérifiez les weblogs : tail -f /var/www/crea-entreprise/server.log"
