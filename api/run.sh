
#!/bin/bash

#node_exporter installation
apk update && apk upgrade && apk add curl

curl -L -O https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-amd64.tar.gz
tar -zxvf node_exporter-1.9.1.linux-amd64.tar.gz
mv node_exporter-1.9.1.linux-amd64/node_exporter /node_exporter

/node_exporter & #run in background to run grafana afterwards

npm run dev # prod: "npm run build && node dist/main.js"
