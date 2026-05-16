@echo off
echo Backup PSG3 - Protection Security Group
echo ========================================
echo.
echo Ce script va créer un backup du dossier psg3 sur le serveur distant
echo Serveur: 109.123.249.114
echo.

echo Connexion au serveur...
plink -ssh -hostkey "ssh-ed25519 255 SHA256:J4La+IiuO8vc1oklAS/STv60NQVhJsLa728f+p0YZlk" root@109.123.249.114 "cd /var/www/html/ && tar -czf psg3-backup-%date:~10,4%%date:~4,2%%date:~7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.tar.gz psg3/ && ls -lh psg3-backup-*.tar.gz | tail -1"

echo.
echo Backup terminé!
pause