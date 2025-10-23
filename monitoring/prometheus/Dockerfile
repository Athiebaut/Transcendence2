FROM alpine:3.21

#prometheus installation
RUN apk update && apk upgrade && apk add libc6-compat curl
RUN wget https://github.com/prometheus/prometheus/releases/download/v3.6.0/prometheus-3.6.0.linux-amd64.tar.gz && \
    tar xvfz prometheus-3.6.0.linux-amd64.tar.gz && \
    mv prometheus-3.6.0.linux-amd64 /prometheus && \
    rm prometheus-3.6.0.linux-amd64.tar.gz

COPY run.sh /run.sh

WORKDIR /prometheus
COPY prometheus.yml /prometheus/prometheus.yml
COPY alert_rules.yml /prometheus/alert_rules.yml

ENTRYPOINT ["/run.sh"]
