#!/bin/sh

curl -L -O https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-amd64.tar.gz
tar -zxvf node_exporter-1.9.1.linux-amd64.tar.gz
mv node_exporter-1.9.1.linux-amd64/node_exporter /node_exporter

/node_exporter &

/grafana/bin/grafana server --homepath /grafana --config /grafana/grafana.ini
