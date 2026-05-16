@echo off
echo ========================================
echo PSG3 - Deploiement sur Vercel
echo ========================================
echo.

echo Etape 1: Installation de Vercel CLI...
npm i -g vercel
if errorlevel 1 (
    echo Erreur lors de l'installation de Vercel CLI
    pause
    exit /b 1
)

echo.
echo Etape 2: Preparation du projet...
cd psg3-local
call npm install
if errorlevel 1 (
    echo Erreur lors de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo Etape 3: Build du projet...
call npm run build
if errorlevel 1 (
    echo Erreur lors du build
    pause
    exit /b 1
)

echo.
echo Etape 4: Deploiement sur Vercel...
echo.
echo Vous allez etre invite a:
echo - 1. Vous connecter a Vercel (ou creer un compte)
echo - 2. Lier le projet a votre equipe
echo - 3. Configurer les variables d'environnement
echo.
echo Variables d'environnement necessaires:
echo - DATABASE_URL: votre connexion PostgreSQL
echo - JWT_SECRET: votre cle secrete JWT
echo.
pause

call vercel
if errorlevel 1 (
    echo Erreur lors du deploiement
    pause
    exit /b 1
)

echo.
echo ========================================
echo DEPLOIEMENT REUSSI !
echo ========================================
echo.
echo Votre portail admin est maintenant deploye sur Vercel !
echo.
echo Prochaines etapes:
echo 1. Configurer la base de donnees sur Vercel
echo 2. Executer: npx prisma db push
echo 3. Executer: npx prisma db seed
echo 4. Tester votre portail admin
echo.
echo Documentation complete: VERCEL-DEPLOY.md
echo.
pause