FROM signoz/signoz-otel-collector:latest

COPY --chmod=755 migrate.sh /migrate.sh

ENTRYPOINT ["/migrate.sh"]
