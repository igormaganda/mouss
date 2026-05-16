@echo off
REM Script d'exécution du déploiement sur le serveur

set SERVER=root@213.199.38.41
set PASSWORD=7Y3k8GKGiWa5lSSiQ
set REMOTE_DIR=/root/a_deployer

echo 🚀 Déploiement de Crea Entreprise sur le serveur...
echo.

echo 🔧 Étape 1 : Donner les permissions d'exécution...
plink -ssh -pw %PASSWORD% %SERVER% "cd %REMOTE_DIR% && chmod +x setup-database.sh deploy-crea-entreprise.sh"

echo.
echo 🗄️ Étape 2 : Création des tables PostgreSQL...
plink -ssh -pw %PASSWORD% %SERVER% "cd %REMOTE_DIR% && ./setup-database.sh"

echo.
echo 🏗️ Étape 3 : Déploiement du site...
plink -ssh -pw %PASSWORD% %SERVER% "cd %REMOTE_DIR% && ./deploy-crea-entreprise.sh"

echo.
echo ✅ Déploiement terminé !
echo.
echo 🌐 Votre site devrait être accessible sur : http://offrespro.fr
echo.
echo 🔍 Pour vérifier le statut :
echo    plink -ssh -pw %PASSWORD% %SERVER% "docker ps"
echo.
pause
