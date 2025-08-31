@echo off
setlocal enabledelayedexpansion

echo Setting up SSL certificates for local development...
echo =================================================

:: Check if running as administrator
net session >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Running with administrator privileges
) else (
    echo This script requires administrator privileges.
    echo Please right-click and select "Run as administrator"
    pause
    exit /b 1
)

:: Set OpenSSL path - update this if your OpenSSL is installed elsewhere
set OPENSSL_PATH="C:\Program Files\OpenSSL-Win64\bin\openssl.exe"

:: Check if OpenSSL exists at the specified path
if not exist %OPENSSL_PATH% (
    echo OpenSSL not found at: %OPENSSL_PATH%
    echo Please check your OpenSSL installation path.
    pause
    exit /b 1
)

:: Create SSL directory if it doesn't exist
if not exist "nginx\ssl" mkdir "nginx\ssl"

:: Change to project root directory
cd /d "%~dp0"

:: Generate private key and self-signed certificate
echo Generating SSL certificate...
%OPENSSL_PATH% req -x509 -nodes -days 365 -newkey rsa:2048 ^
    -keyout nginx\ssl\localhost.key ^
    -out nginx\ssl\localhost.crt ^
    -subj "/CN=localhost" ^
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

if %ERRORLEVEL% neq 0 (
    echo Failed to generate SSL certificate.
    pause
    exit /b 1
)

:: Convert certificate to .pem format
type nginx\ssl\localhost.crt > nginx\ssl\localhost.pem

:: Install certificate in trusted root
echo Installing certificate in Trusted Root Certification Authorities...
%SYSTEMROOT%\System32\certutil -f -addstore Root nginx\ssl\localhost.crt

if %ERRORLEVEL% neq 0 (
    echo Failed to install certificate in Trusted Root store.
    echo You may need to install it manually by double-clicking nginx\ssl\localhost.crt
) else (
    echo Certificate installed successfully in Trusted Root store.
)

echo.
echo SSL setup completed!
echo Certificate files created in: %~dp0nginx\ssl\
echo.
echo You may need to restart your browser for the changes to take effect.

:: Verify files were created
echo.
echo Verifying certificate files...
if exist "nginx\ssl\localhost.crt" (
    echo - localhost.crt: Found
) else (
    echo - localhost.crt: Not found!
)
if exist "nginx\ssl\localhost.key" (
    echo - localhost.key: Found
) else (
    echo - localhost.key: Not found!
)
if exist "nginx\ssl\localhost.pem" (
    echo - localhost.pem: Found
) else (
    echo - localhost.pem: Not found!
)

pause
