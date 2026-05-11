FROM signoz/signoz-otel-collector:latest

COPY migrate.sh /migrate.sh
RUN chmod +x /migrate.sh

ENTRYPOINT ["/migrate.sh"]
