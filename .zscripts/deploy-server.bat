@echo off
REM ==============================================
REM DEPLOY TO SERVER - Windows Script (Improved)
REM ==============================================

setlocal enabledelayedexpansion

set SERVER=root@213.199.38.41
set PROJECT_DIR=/var/www/html/runweekv3

echo ============================================
echo   RunWeek - Deploy to Server
echo ============================================
echo.
echo Server: %SERVER%
echo.

REM Detect SSH client
set SSH_CMD=
set USING_PUTTY=0

where plink >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set SSH_CMD=plink
    set USING_PUTTY=1
    echo [OK] Using PuTTY/plink
    goto :ssh_found
)

where ssh >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set SSH_CMD=ssh
    set USING_PUTTY=0
    echo [OK] Using OpenSSH
    goto :ssh_found
)

echo [ERROR] No SSH client found!
echo.
echo Please install one of:
echo   1. Git for Windows (includes OpenSSH)
echo      https://git-scm.com/download/win
echo   2. PuTTY
echo      https://www.putty.org/
echo.
pause
exit /b 1

:ssh_found
echo.

REM For PuTTY, use -pw to pass password directly
if %USING_PUTTY%==1 (
    echo [INFO] Using password authentication...
    echo.

    %SSH_CMD% -pw "7Y3k8GKGiWa5lSSiQ" %SERVER% "cd %PROJECT_DIR% && bash .zscripts/deploy-blog-fix.sh"

) else (
    echo [INFO] Please enter server password when prompted...
    echo [INFO] Password: 7Y3k8GKGiWa5lSSiQ
    echo.

    %SSH_CMD% %SERVER% "cd %PROJECT_DIR% && bash .zscripts/deploy-blog-fix.sh"
)

echo.
echo ============================================
echo   Deployment completed!
echo ============================================
echo.
echo Check: https://runweek.fr/blog
echo.
pause
