# 📋 Prochaines Étapes - Crea Entreprise

## 🎯 Résumé du déploiement actuel

✅ **Site déployé et fonctionnel** : http://213.199.38.41
✅ **Base de données PostgreSQL** configurée
✅ **Service Next.js** actif (port 3000)
✅ **nginx** configuré (port 80)
⚠️ **DNS** à configurer pour `offrespro.fr`
⚠️ **SSL/HTTPS** à activer
⚠️ **Stripe** à configurer (si vous utilisez les paiements)

---

## 📝 Instructions étape par étape

### ÉTAPE 1 : Configuration DNS ⚠️ OBLIGATOIRE

**Action requise** : Connectez-vous à votre panneau de contrôle de domaine (où vous avez acheté `offrespro.fr`) et ajoutez/modifiez les enregistrements DNS :

#### Pour le domaine principal
```
Type: A
Nom/Host: @ (ou offrespro.fr)
Valeur: 213.199.38.41
TTL: 3600 (ou 1 heure)
```

#### Pour le sous-domaine www
```
Type: A
Nom/Host: www
Valeur: 213.199.38.41
TTL: 3600 (ou 1 heure)
```

#### Vérification
Une fois configuré, attendez la propagation DNS (1-24h) et vérifiez :
```bash
nslookup offrespro.fr
# Doit retourner : 213.199.38.41
```

---

### ÉTAPE 2 : Activation SSL/HTTPS 🔒

**⚠️ PRÉ-REQUIS** : Le DNS doit être configuré (Étape 1)

Une fois le DNS propagé et vérifié :

#### Option A : Exécution automatique (recommandé)
```bash
# Se connecter au serveur
ssh root@213.199.38.41

# Exécuter le script SSL
/root/setup-ssl.sh
```

#### Option B : Exécution manuelle
```bash
# Se connecter au serveur
ssh root@213.199.38.41

# Obtenir le certificat SSL
certbot certonly --webroot -w /var/www/html \
    -d offrespro.fr \
    -d www.offrespro.fr \
    --email admin@offrespro.fr \
    --agree-tos \
    --no-eff-email

# Appliquer la configuration SSL
mv /etc/nginx/sites-available/crea-entreprise /etc/nginx/sites-available/crea-entreprise-old
cp /root/a_deployer/nginx.conf /etc/nginx/sites-available/crea-entreprise
# Éditer pour décommenter la section SSL

# Recharger nginx
nginx -t && systemctl reload nginx
```

#### Vérification SSL
```bash
# Vérifier que HTTPS fonctionne
curl -I https://offrespro.fr

# Vérifier le certificat
curl -v https://offrespro.fr 2>&1 | grep -E "issuer|subject"
```

---

### ÉTAPE 3 : Configuration Stripe 💳

**Optionnel** : Seulement si vous utilisez les paiements Stripe sur votre site.

#### 3.1 Obtenir les clés Stripe

1. Créez un compte Stripe : https://dashboard.stripe.com/register
2. Accédez aux clés API : https://dashboard.stripe.com/apikeys
3. Notez les clés suivantes :
   - **Secret key** : `sk_test_...` (test) ou `sk_live_...` (production)
   - **Publishable key** : `pk_test_...` (test) ou `pk_live_...` (production)

#### 3.2 Configurer les clés

```bash
# Se connecter au serveur
ssh root@213.199.38.41

# Exécuter le script de configuration Stripe
/root/setup-stripe.sh
```

Suivez les instructions pour entrer vos clés Stripe.

#### 3.3 Configurer le Webhook Stripe

1. Allez dans : https://dashboard.stripe.com/webhooks
2. Cliquez sur "Add endpoint"
3. Configurez :
   - **Endpoint URL** : `https://offrespro.fr/api/webhooks/stripe`
   - **Events to listen to** :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
4. Copiez le **Webhook Secret** (`whsec_...`)
5. Ajoutez-le avec le script `/root/setup-stripe.sh`

#### 3.4 Tester Stripe

```bash
# Créer un produit de test dans le dashboard Stripe
# Tester le processus de paiement sur : https://offrespro.fr
# Vérifier les logs
tail -f /var/www/crea-entreprise/server.log
```

---

## 🔧 Scripts disponibles sur le serveur

### `/root/setup-ssl.sh`
Configure automatiquement SSL avec Let's Encrypt

### `/root/setup-stripe.sh`
Configure les clés Stripe de manière interactive

### `/var/www/crea-entreprise/start-prod.sh`
Script de démarrage de l'application

---

## 📊 Monitoring et maintenance

### Vérifier le statut de l'application
```bash
# Statut du service
systemctl status crea-entreprise.service

# Voir les logs en temps réel
journalctl -u crea-entreprise.service -f

# Logs nginx
tail -f /var/log/nginx/crea-entreprise-access.log
tail -f /var/log/nginx/crea-entreprise-error.log
```

### Redémarrer l'application
```bash
# Redémarrer le service
systemctl restart crea-entreprise.service

# Vérifier après redémarrage
systemctl status crea-entreprise.service
```

### Mises à jour futures
```bash
# Se connecter au serveur
ssh root@213.199.38.41

# Aller dans le répertoire de l'application
cd /var/www/crea-entreprise

# Mettre à jour les dépendances
/root/.bun/bin/bun install

# Rebuild l'application
/root/.bun/bin/bun run build

# Redémarrer le service
systemctl restart crea-entreprise.service
```

---

## 🔒 Sécurité recommandée

### 1. Firewall
```bash
# Installer ufw
apt install -y ufw

# Configurer le firewall
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Vérifier le statut
ufw status
```

### 2. Sécurité SSH
```bash
# Éditer la configuration SSH
nano /etc/ssh/sshd_config

# Modifications recommandées :
# PermitRootLogin no
# PasswordAuthentication no

# Redémarrer SSH
systemctl restart sshd
```

### 3. Sauvegardes automatiques
```bash
# Créer un script de sauvegarde
cat > /root/backup.sh << 'EOF'
#!/bin/bash
# Sauvegarde de la base de données et des fichiers
BACKUP_DIR="/var/backups/crea-entreprise"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Sauvegarder PostgreSQL
pg_dump "postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours" > $BACKUP_DIR/db_$DATE.sql

# Sauvegarder les fichiers
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/crea-entreprise

# Supprimer les sauvegardes de plus de 7 jours
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /root/backup.sh

# Ajouter à crontab pour exécution quotidienne
crontab -e
# Ajouter : 0 2 * * * /root/backup.sh
```

---

## 📞 Support et dépannage

### L'application ne démarre pas
```bash
# Vérifier les logs
journalctl -u crea-entreprise.service -n 50

# Vérifier si bun fonctionne
/root/.bun/bin/bun --version

# Tester manuellement
cd /var/www/crea-entreprise
/root/.bun/bin/bun next start -p 3000
```

### nginx ne fonctionne pas
```bash
# Vérifier la configuration
nginx -t

# Voir les logs nginx
tail -f /var/log/nginx/error.log

# Redémarrer nginx
systemctl restart nginx
```

### Problèmes de base de données
```bash
# Tester la connexion
psql "postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours" -c "\l"

# Vérifier les tables
psql "postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours" -c "\dt"
```

---

## 📝 Checklist de déploiement

- [ ] DNS configuré pour `offrespro.fr` → `213.199.38.41`
- [ ] DNS vérifié avec `nslookup offrespro.fr`
- [ ] Certificat SSL obtenu avec `/root/setup-ssl.sh`
- [ ] HTTPS testé avec `curl -I https://offrespro.fr`
- [ ] Stripe configuré (si nécessaire)
- [ ] Webhook Stripe configuré (si nécessaire)
- [ ] Firewall configuré
- [ ] Sauvegardes automatiques configurées
- [ ] Monitoring mis en place

---

**Document créé** : 15 mai 2026
**Version** : 1.0
**Serveur** : 213.199.38.41
**Domaine** : offrespro.fr
