# Guide de déploiement - Crea Entreprise

## 📋 Pré-requis

- Accès SSH au serveur (213.199.38.41)
- Fichier tar déjà présent sur le serveur dans `/root/a_deployer/crea-entreprise-1.tar`
- Base de données PostgreSQL configurée

## 🚀 Étapes de déploiement

### 1. Se connecter au serveur

```bash
ssh root@213.199.38.41
# Mot de passe : 7Y3k8GKGiWa5lSSiQ
```

### 2. Transférer les fichiers de déploiement

Depuis votre machine locale, transférez les fichiers créés :

```bash
# Transférer le script de déploiement
scp deploy-crea-entreprise.sh root@213.199.38.41:/root/

# Transférer docker-compose.yml
scp docker-compose.yml root@213.199.38.41:/root/a_deployer/

# Transférer nginx.conf
scp nginx.conf root@213.199.38.41:/root/a_deployer/
```

### 3. Exécuter le script de déploiement

Une fois connecté au serveur :

```bash
cd /root
chmod +x deploy-crea-entreprise.sh
./deploy-crea-entreprise.sh
```

### 4. Vérifier le déploiement

```bash
# Voir les conteneurs en cours d'exécution
docker ps

# Voir les logs
docker-compose -f /var/www/crea-entreprise/docker-compose.yml logs -f

# Vérifier que le site répond
curl http://localhost:3000
```

### 5. Configurer SSL (HTTPS)

```bash
# Installer Certbot
apt update && apt install certbot python3-certbot-nginx -y

# Obtenir un certificat SSL
certbot --nginx -d offrespro.fr -d www.offrespro.fr

# Renouvellement automatique est configuré par défaut
```

## 🔧 Configuration DNS

Assurez-vous que les enregistrements DNS pointent vers votre serveur :

- **A Record** : `offrespro.fr` → `213.199.38.41`
- **A Record** : `www.offrespro.fr` → `213.199.38.41`

## 📊 Base de données

La connexion à la base de données PostgreSQL est déjà configurée avec l'URL :

```
postgresql://admin_100jours:J0urs!2026*Cent@109.123.249.114:5432/100jours
```

### Créer une table (si nécessaire)

```bash
# Se connecter à PostgreSQL
docker run -it --rm postgres:15 psql "$DATABASE_URL"

# Créer une table exemple
CREATE TABLE IF NOT EXISTS entreprises (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\q
```

## 🛠️ Commandes utiles

```bash
# Voir les logs en temps réel
docker-compose logs -f app

# Redémarrer les services
docker-compose restart

# Arrêter les services
docker-compose down

# Mettre à jour le site
cd /var/www/crea-entreprise
git pull  # ou extraire un nouveau tar
docker-compose up -d --build
```

## 🔍 Dépannage

### Le site ne s'affiche pas

```bash
# Vérifier que les conteneurs tournent
docker ps -a

# Vérifier les logs
docker-compose logs

# Vérifier que le port 80 est ouvert
netstat -tulpn | grep :80
```

### Erreur de connexion à la base de données

```bash
# Tester la connexion
docker run -it --rm postgres:15 psql "$DATABASE_URL"

# Vérifier que la base de données existe
psql "$DATABASE_URL" -c "\l"
```

### Problèmes de permissions

```bash
# Donner les permissions correctes
chown -R root:root /var/www/crea-entreprise
chmod -R 755 /var/www/crea-entreprise
```

## 📞 Support

Si vous rencontrez des problèmes, vérifiez :
1. Les logs des conteneurs Docker
2. La configuration nginx
3. La connexion à la base de données
4. Les enregistrements DNS
