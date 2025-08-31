@echo off
setlocal enabledelayedexpansion

REM Check if OpenSSL is installed
where openssl >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo OpenSSL is not installed or not in PATH. Please install OpenSSL first.
    echo You can get it from: https://slproweb.com/products/Win32OpenSSL.html
    pause
    exit /b 1
)

REM Create SSL directory if it doesn't exist
if not exist "nginx\ssl" mkdir "nginx\ssl"

REM Generate private key and self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 ^
    -keyout nginx\ssl\localhost.key ^
    -out nginx\ssl\localhost.crt ^
    -subj "/CN=localhost" ^
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

if %ERRORLEVEL% equ 0 (
    echo.
    echo SSL certificate generated successfully!
    echo.
    echo Files created:
    echo   - nginx\ssl\localhost.key (private key)
    echo   - nginx\ssl\localhost.crt (certificate)
    echo.
    echo Note: You may need to trust the certificate in your browser.
    echo On Windows, double-click the .crt file and install it in the 'Trusted Root Certification Authorities' store.
) else (
    echo.
    echo Error generating SSL certificate.
    echo Make sure OpenSSL is properly installed and you have write permissions.
)

pause
