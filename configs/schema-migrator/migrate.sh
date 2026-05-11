#!/bin/sh
set -e

/signoz-otel-collector migrate bootstrap --clickhouse-dsn="$CLICKHOUSE_DSN"
/signoz-otel-collector migrate sync up --clickhouse-dsn="$CLICKHOUSE_DSN"
/signoz-otel-collector migrate async up --clickhouse-dsn="$CLICKHOUSE_DSN"

echo "migrations complete; idling"
exec tail -f /dev/null
