param(
    [Parameter(Mandatory=$true)]
    [string]$backupFile
)

if (-not (Test-Path $backupFile)) {
    Write-Host "❌ Error: Backup file not found: $backupFile"
    exit 1
}

Write-Host "Restoring database from $backupFile"
Write-Host "This will overwrite your current database. Are you sure? (Y/N)"
$confirmation = Read-Host

if ($confirmation -ne 'Y' -and $confirmation -ne 'y') {
    Write-Host "Restore cancelled"
    exit 0
}

try {
    Get-Content $backupFile | docker exec -i bible-postgres psql -U postgres
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database restored successfully!"
    } else {
        Write-Host "❌ Restore failed with error code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ Error during restore: $_"
}
