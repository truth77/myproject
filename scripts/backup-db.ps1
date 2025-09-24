# Database backup script
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "$PSScriptRoot\..\backups\postgres"
$backupFile = "$backupDir\bible_backup_${timestamp}.sql"

# Ensure backup directory exists
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

Write-Host "Creating database backup to $backupFile"
docker exec -t bible-postgres pg_dumpall -c -U postgres > $backupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup completed successfully!"
    Write-Host "Backup saved to: $backupFile"
} else {
    Write-Host "❌ Backup failed with error code $LASTEXITCODE"
}
