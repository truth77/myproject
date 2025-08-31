#!/bin/bash

# Create ssl directory if it doesn't exist
mkdir -p nginx/ssl

# Generate private key and self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/localhost.key \
  -out nginx/ssl/localhost.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Set proper permissions
chmod 644 nginx/ssl/localhost.crt
chmod 600 nginx/ssl/localhost.key

echo "SSL certificates generated in nginx/ssl/ directory"
