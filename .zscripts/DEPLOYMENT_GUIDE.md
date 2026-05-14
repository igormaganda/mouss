# RunWeek - Guide de Déploiement Blog

## 📋 Problème identifié
- La table `posts` n'existe pas dans la base PostgreSQL
- Le modèle `Post` était manquant dans le schéma Prisma
- Les articles de blog sont déjà préparés dans `prisma/seed-articles.ts`

## ✅ Ce qui a été fait
1. ✅ Ajout du modèle `Post` dans `prisma/schema.prisma`
2. ✅ Ajout de la relation `posts` dans le modèle `User`
3. ✅ Pages légales déjà complètes (RUNWEEK MEDIA)
4. ✅ Bannière cookies déjà fonctionnelle
5. ✅ Scripts de déploiement créés

## 🚀 Procédure de déploiement

### Option A - Windows (.bat)

**Étape 1 - Préparer le code (en LOCAL)**
```cmd
# Double-cliquer ou exécuter
.zscripts\prepare-deploy.bat
```

**Étape 2 - Déployer sur le serveur**
```cmd
# Double-cliquer ou exécuter
.zscripts\deploy-server.bat
```

### Option B - Linux/Mac/Terminal (.sh)

**Étape 1 - Préparer le code (en LOCAL)**
```bash
# Exécuter le script de préparation
bash .zscripts/prepare-deploy.sh
```

**Étape 2 - Déployer sur le serveur**
```bash
# Se connecter au serveur
ssh root@213.199.38.41

# Exécuter le script de déploiement
cd /var/www/html/runweekv3
bash .zscripts/deploy-blog-fix.sh
```

### Étape 3 - Vérifier

```bash
# Sur le serveur, vérifier PM2
pm2 status
pm2 logs runweekv3 --lines 50

# Sur le navigateur
# https://runweek.fr/blog
# https://runweek.fr/blog/comment-choisir-son-statut-juridique-en-2025
```

## 📝 Articles de blog (20 articles pré-préparés)

Catégories :
- **Création d'entreprise** (4 articles)
- **Banque Pro** (3 articles)
- **Comptabilité** (4 articles)
- **Assurances** (3 articles)
- **Marketing & Acquisition** (3 articles)
- **Gestion & Productivité** (3 articles)

## 🔧 Commandes utiles

```bash
# Vérifier la connexion BDD
npx prisma db push

# Voir les posts existants
npx prisma studio

# Compter les posts
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.post.count().then(c=>console.log('Posts:',c))"

# Restart propre PM2
pm2 restart runweekv3 --update-env
```

## 🆘 En cas de problème

```bash
# Restaurer le backup
cp -r /var/www/html/backups/runweekv3-[DATE]/.next /var/www/html/runweekv3/

# Rebuild sans seed
cd /var/www/html/runweekv3
npm run build
pm2 restart runweekv3

# Voir les logs PostgreSQL
# (dépend de votre hébergement)
```

## 📞 Contact
- Projet : RunWeek
- Serveur : 213.199.38.41
- Répertoire : /var/www/html/runweekv3
