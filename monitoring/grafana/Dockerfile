FROM alpine:3.21

RUN apk update && apk upgrade && apk add libc6-compat curl
RUN curl -L -O https://dl.grafana.com/oss/release/grafana-12.2.0.linux-amd64.tar.gz
RUN tar -zxvf grafana-12.2.0.linux-amd64.tar.gz
RUN mv grafana-12.2.0 /grafana
RUN adduser -D grafana


WORKDIR /

COPY grafana.ini /grafana/grafana.ini

COPY run.sh /run.sh
RUN chmod +x /run.sh


ENTRYPOINT ["./run.sh"]

