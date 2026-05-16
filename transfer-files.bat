@echo off
REM Script de transfert des fichiers vers le serveur avec plink/pscp

set SERVER=root@213.199.38.41
set PASSWORD=7Y3k8GKGiWa5lSSiQ
set REMOTE_DIR=/root/a_deployer

echo 📤 Transfert des fichiers vers le serveur...
echo.

REM Créer le répertoire distant
echo 📂 Création du répertoire distant...
plink -ssh -pw %PASSWORD% %SERVER% "mkdir -p %REMOTE_DIR%"

REM Transférer les fichiers
echo 📦 Transfert de deploy-crea-entreprise.sh...
pscp -pw %PASSWORD% deploy-crea-entreprise.sh %SERVER%:%REMOTE_DIR%/

echo 📦 Transfert de docker-compose.yml...
pscp -pw %PASSWORD% docker-compose.yml %SERVER%:%REMOTE_DIR%/

echo 📦 Transfert de nginx.conf...
pscp -pw %PASSWORD% nginx.conf %SERVER%:%REMOTE_DIR%/

echo 📦 Transfert de create-table.sql...
pscp -pw %PASSWORD% create-table.sql %SERVER%:%REMOTE_DIR%/

echo 📦 Transfert de setup-database.sh...
pscp -pw %PASSWORD% setup-database.sh %SERVER%:%REMOTE_DIR%/

echo 📦 Transfert de README-DEPLOY.md...
pscp -pw %PASSWORD% README-DEPLOY.md %SERVER%:%REMOTE_DIR%/

echo 📦 Transfert de QUICKSTART.md...
pscp -pw %PASSWORD% QUICKSTART.md %SERVER%:%REMOTE_DIR%/

echo.
echo ✅ Tous les fichiers ont été transférés avec succès !
echo.
echo 🔗 Prochaine étape : Exécutez maintenant deploy-on-server.bat
pause
