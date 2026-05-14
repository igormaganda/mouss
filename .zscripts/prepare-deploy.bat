@echo off
REM ==============================================
REM PREPARE DEPLOYMENT - Windows Script
REM ==============================================
REM Execute this script LOCALLY before deployment
REM It commits changes and pushes to remote
REM ==============================================

setlocal enabledelayedexpansion

echo ============================================
echo   Prepare Deployment - Local (Windows)
echo ============================================
echo.

REM Check if we're on the right branch
for /f "tokens=*" %%a in ('git branch --show-current') do set CURRENT_BRANCH=%%a
echo Current branch: %CURRENT_BRANCH%
echo.

REM Add files
echo [1/4] Adding changes...
git add prisma/schema.prisma
git add .zscripts/deploy-blog-fix.sh
git add .zscripts/prepare-deploy.sh
git add .zscripts/prepare-deploy.bat
git add .zscripts/DEPLOYMENT_GUIDE.md
echo.

REM Commit changes
echo [2/4] Committing changes...
git commit -m "fix: add Post model to Prisma schema and deployment scripts

- Add Post model for blog functionality
- Add posts relation to User model
- Create deployment scripts for blog fix
- Enable blog articles with 20 pre-seeded posts

Co-Authored-By: Claude Opus 4.7 ^<noreply@anthropic.com^>"
echo.

REM Push to remote
echo [3/4] Pushing to remote...
git push origin main
echo.

REM Summary
echo ============================================
echo   Changes pushed successfully!
echo ============================================
echo.
echo Next steps:
echo   1. Connect to server: ssh root@213.199.38.41
echo   2. Run: cd /var/www/html/runweekv3
echo   3. Run: bash .zscripts/deploy-blog-fix.sh
echo.
pause
