# Generate SSL Certificate for Local Development
# Run this script as Administrator

# Create SSL directory if it doesn't exist
$sslDir = "nginx\ssl"
if (-not (Test-Path -Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir -Force | Out-Null
}

# Generate certificate in current user store (works without admin)
$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "cert:\CurrentUser\My"

# Export certificate to file
$cert | Export-Certificate -FilePath "$sslDir\localhost.crt" -Type CERT

# Create .pem file
$pem = @("-----BEGIN CERTIFICATE-----")
$pem += [System.Convert]::ToBase64String($cert.RawData) -replace ".{64}", "`$&`n"
$pem += "-----END CERTIFICATE-----"
[System.IO.File]::WriteAllLines("$sslDir\localhost.pem", $pem)

# Create .key file (empty for now, as we can't export private key without admin)
Set-Content -Path "$sslDir\localhost.key" -Value ""

# Show success message
Write-Host "`nCertificate generated successfully!" -ForegroundColor Green
Write-Host "Files created in: $PWD\$sslDir\"
Write-Host "- localhost.crt (Certificate)"
Write-Host "- localhost.pem (PEM format)"
Write-Host "- localhost.key (Empty - needs manual setup)"

# Instructions
Write-Host "`nNext steps:"
Write-Host "1. Trust the certificate in your browser by double-clicking localhost.crt"
Write-Host "2. Install in 'Trusted Root Certification Authorities'"
Write-Host "3. For production, replace these with real certificates from Let's Encrypt"
