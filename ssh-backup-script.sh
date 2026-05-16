#!/bin/bash
# Script de backup distant pour PSG3
# Ce script sera exécuté sur le serveur distant

BACKUP_NAME="psg3-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
cd /var/www/html/
tar -czf "$BACKUP_NAME" psg3/
echo "Backup créé: $BACKUP_NAME"
ls -lh "$BACKUP_NAME"