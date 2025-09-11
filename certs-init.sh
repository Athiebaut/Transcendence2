#!/bin/sh
set -eu
mkdir -p /etc/nginx/certs
CERT=/etc/nginx/certs/localhost.pem
KEY=/etc/nginx/certs/localhost-key.pem
if [ ! -f "$CERT" ] || [ ! -f "$KEY" ]; then
  cat > /tmp/openssl.cnf <<'EOF'
[req]
default_bits = 2048
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
CN = localhost
[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
DNS.2 = front.localhost
DNS.3 = transcendence.localhost
EOF
  openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout "$KEY" -out "$CERT" -config /tmp/openssl.cnf
fi
