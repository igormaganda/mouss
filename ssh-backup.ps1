# PowerShell script pour backup distant PSG3
$password = ConvertTo-SecureString "oQw16cma9X0AL4JVjSz" -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ("root", $password)

$command = "cd /var/www/html/ && tar -czf psg3-backup-$(date +%Y%m%d-%H%M%S).tar.gz psg3/ && ls -lh psg3-backup-*.tar.gz | tail -1"

$session = New-SSHSession -ComputerName "109.123.249.114" -Credential $credential -AcceptKey
Invoke-SSHCommand -SessionId $session.SessionId -Command $command
Remove-SSHSession -SessionId $session.SessionId