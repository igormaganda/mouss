@echo off
echo PSG3 Admin Portal Deployment Script
echo =====================================
echo.

set SERVER=109.123.249.114
set SERVER_USER=root
set SERVER_PATH=/var/www/html/psg3
set LOCAL_PATH="C:\Users\Administrator\Downloads\Projets\psg3-local"

echo Step 1: Build the project...
cd %LOCAL_PATH%
call npm run build
if errorlevel 1 (
    echo Build failed! Exiting.
    pause
    exit /b 1
)

echo.
echo Step 2: Create deployment package...
set TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set PACKAGE_FILE=psg3-deploy-%TIMESTAMP%.tar.gz

tar -czf %PACKAGE_FILE% --exclude=node_modules --exclude=.git --exclude=dist --exclude=uploads --exclude=.env .
if errorlevel 1 (
    echo Package creation failed! Exiting.
    pause
    exit /b 1
)

echo Package created: %PACKAGE_FILE%
echo.
echo Step 3: Upload package to server...
pscp -ssh -hostkey "ssh-ed25519 255 SHA256:J4La+IiuO8vc1oklAS/STv60NQVhJsLa728f+p0YZlk" -pw "oQw16cma9X0AL4JVjSz" %PACKAGE_FILE% %SERVER_USER%@%SERVER%:/tmp/
if errorlevel 1 (
    echo Upload failed! Exiting.
    pause
    exit /b 1
)

echo.
echo Step 4: Extract and deploy on server...
plink -ssh -hostkey "ssh-ed25519 255 SHA256:J4La+IiuO8vc1oklAS/STv60NQVhJsLa728f+p0YZlk" %SERVER_USER%@%SERVER% -pw "oQw16cma9X0AL4JVjSz" "cd %SERVER_PATH% && tar -xzf /tmp/%PACKAGE_FILE% && rm /tmp/%PACKAGE_FILE% && npm install && npm run build"
if errorlevel 1 (
    echo Deployment on server failed! Exiting.
    pause
    exit /b 1
)

echo.
echo =====================================
echo Deployment completed successfully!
echo =====================================
echo.
echo Next steps:
echo 1. Configure .env file on server
echo 2. Run database migrations: npm run db:setup
echo 3. Restart the server
echo.
echo Server URL: http://%SERVER%
echo Admin Portal: http://protectionsecuritygroup.com/portal
echo.
pause