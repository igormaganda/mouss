# ==============================================
# DEPLOY TO SERVER - PowerShell Script
# ==============================================
# Plus fiable que le .bat pour Windows
# ==============================================

$ErrorActionPreference = "Continue"

$SERVER = "root@213.199.38.41"
$PASSWORD = "7Y3k8GKGiWa5lSSiQ"
$PROJECT_DIR = "/var/www/html/runweekv3"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RunWeek - Deploy to Server (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server: $SERVER" -ForegroundColor Yellow
Write-Host ""

# Vérifier si plink est disponible (PuTTY)
$plinkPath = Get-Command plink -ErrorAction SilentlyContinue

if ($plinkPath) {
    Write-Host "[OK] Using PuTTY/plink" -ForegroundColor Green

    # Créer la commande SSH
    $command = "cd $PROJECT_DIR && bash .zscripts/deploy-blog-fix.sh"

    # Exécuter avec plink (mot de passe en ligne de commande)
    & plink -batch -pw $PASSWORD $SERVER $command

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  Deployment completed!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Check: https://runweek.fr/blog" -ForegroundColor Yellow

} else {
    Write-Host "[ERROR] PuTTY (plink) not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PuTTY:" -ForegroundColor Yellow
    Write-Host "  https://www.putty.org/"
    Write-Host ""
    Write-Host "Or use Git Bash / WSL to run:" -ForegroundColor Yellow
    Write-Host "  ssh $SERVER"
    Write-Host "  cd $PROJECT_DIR"
    Write-Host "  bash .zscripts/deploy-blog-fix.sh"
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
