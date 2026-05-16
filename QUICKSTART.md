# 🚀 Démarrage rapide - Déploiement Crea Entreprise

## ⚡ En 3 étapes simples

### 1️⃣ Transférer les fichiers sur votre serveur

```bash
# Depuis votre ordinateur (dans le dossier où sont les fichiers créés)
scp deploy-crea-entreprise.sh docker-compose.yml nginx.conf create-table.sql setup-database.sh root@213.199.38.41:/root/
```

### 2️⃣ Se connecter au serveur et créer les tables

```bash
# Connexion SSH
ssh root@213.199.38.41
# Mot de passe : 7Y3k8GKGiWa5lSSiQ

# Créer les tables PostgreSQL
chmod +x setup-database.sh
./setup-database.sh
```

### 3️⃣ Déployer le site

```bash
# Exécuter le déploiement
chmod +x deploy-crea-entreprise.sh
./deploy-crea-entreprise.sh
```

## ✅ Vérifier le déploiement

```bash
# Voir les conteneurs actifs
docker ps

# Voir les logs
docker logs -f crea-entreprise-app
```

## 🌐 Accéder au site

Une fois terminé, votre site sera accessible sur :
- **http** : http://offrespro.fr
- **https** : https://offrespro.fr (après configuration SSL)

## 📞 Si problème

1. Vérifiez que les fichiers sont bien transférés : `ls -la /root/`
2. Vérifiez les logs : `docker-compose logs`
3. Consultez le guide complet : [README-DEPLOY.md](README-DEPLOY.md)

---

**Temps estimé** : 5-10 minutes
