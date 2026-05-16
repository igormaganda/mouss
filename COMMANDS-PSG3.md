# 🛠️ Guide de Commandes - Portail Admin PSG

## 🚀 Commandes Essentielles

### Démarrage/Arrêt du Serveur

```bash
# Démarrer le serveur
cd /var/www/html/psg3 && nohup npm run dev > /var/log/psg3-server.log 2>&1 &

# Arrêter le serveur
pkill -f 'node.*psg3'

# Vérifier si le serveur tourne
ps aux | grep 'node.*psg3' | grep -v grep

# Voir les logs en temps réel
tail -f /var/log/psg3-server.log
```

### Base de Données PostgreSQL

```bash
# Connexion à la base de données
sudo -u postgres psql -d psg3_db

# Voir toutes les tables
\dt

# Voir les utilisateurs créés
SELECT id, email, role, active FROM "User";

# Compter les employés
SELECT COUNT(*) FROM "User" WHERE role = 'employee';

# Voir les profils employés
SELECT * FROM "EmployeeProfile";

# Voir les documents
SELECT * FROM "Document";

# Voir le journal d'audit
SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 10;

# Quitter PostgreSQL
\q
```

### Gestion Prisma

```bash
# Régénérer le client Prisma
cd /var/www/html/psg3 && npx prisma generate

# Créer les tables (si nécessaire)
cd /var/www/html/psg3 && npx prisma db push

# Voir le schéma
cat /var/www/html/psg3/prisma/schema.prisma
```

### Maintenance

```bash
# Vérifier l'espace disque
df -h

# Vérifier l'utilisation mémoire
free -h

# Vérifier les processus Node.js
ps aux | grep node | grep -v grep

# Arrêter tous les processus Node.js (attention!)
pkill -f node
```

## 🔧 Dépannage

### Le serveur ne démarre pas

```bash
# 1. Vérifier les logs pour les erreurs
tail -50 /var/log/psg3-server.log

# 2. Vérifier si le port est déjà utilisé
lsof -ti:3012

# 3. Libérer le port si nécessaire
lsof -ti:3012 | xargs kill -9

# 4. Redémarrer le serveur
cd /var/www/html/psg3 && pkill -f 'node.*psg3' && nohup npm run dev > /var/log/psg3-server.log 2>&1 &
```

### Problèmes de base de données

```bash
# Vérifier si PostgreSQL tourne
sudo systemctl status postgresql

# Démarrer PostgreSQL si arrêté
sudo systemctl start postgresql

# Vérifier la connexion
sudo -u postgres psql -c "SELECT version();"

# Recréer la base de données si nécessaire
sudo -u postgres psql -c "DROP DATABASE IF EXISTS psg3_db;"
sudo -u postgres psql -c "CREATE DATABASE psg3_db OWNER psg3_user;"
```

### Problèmes de permissions

```bash
# Donner les permissions au dossier uploads
cd /var/www/html/psg3
chmod 755 uploads uploads/admin

# Vérifier les permissions
ls -la uploads/
```

## 📊 Monitoring

### Statistiques en temps réel

```bash
# Utilisation CPU/Mémoire
htop

# Traffic réseau
iftop

# Requêtes HTTP
tail -f /var/log/psg3-server.log | grep "POST\|GET"
```

### Base de données monitoring

```bash
# Connexions actives
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Taille de la base de données
sudo -u postgres psql -d psg3_db -c "SELECT pg_size_pretty(pg_database_size('psg3_db'));"

# Table des plus grandes tables
sudo -u postgres psql -d psg3_db -c "SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

## 🔐 Sécurité

### Changer le mot de passe admin

```bash
# Connexion à la base de données
sudo -u postgres psql -d psg3_db

# Générer un nouveau hash (nécessite Node.js)
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('VOTRE_NOUVEAU_MDP', 12));"

# Mettre à jour le mot de passe (remplacer HASH par le résultat ci-dessus)
UPDATE "User" SET "passwordHash" = 'HASH' WHERE email = 'admin@psg.com';
```

### Backup manuel

```bash
# Backup de la base de données
sudo -u postgres pg_dump psg3_db > psg3_db_backup_$(date +%Y%m%d).sql

# Backup des fichiers
cd /var/www/html && tar -czf psg3_files_backup_$(date +%Y%m%d).tar.gz psg3/

# Restaurer la base de données
sudo -u postgres psql -d psg3_db < psg3_db_backup_20260515.sql
```

## 📝 Logs Importants

```bash
# Logs du serveur PSG3
/var/log/psg3-server.log

# Logs système (erreurs)
journalctl -u node -f

# Logs authentification
journalctl -f | grep -i psg3
```

## 🌐 Test du portail

```bash
# Test si le serveur répond
curl -I http://localhost:3012

# Test de l'API login
curl -X POST http://localhost:3012/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@psg.com","password":"Admin#2026!"}'

# Test de l'API utilisateurs (nécessite un token valide)
curl -X GET http://localhost:3012/api/admin/users \
  -H "Authorization:Bearer VOTRE_TOKEN"
```

---

**💡 Astuce:** Garder ce fichier accessible pour les opérations courantes d'administration et de maintenance du portail PSG.