sleep 15
# Create buckets
mkdir -p /data/prefect-flows
mkdir -p /data/landing-zone
mkdir -p /data/raw-zone
mkdir -p /data/trusted-zone
mkdir -p /data/refined-zone
mkdir -p /data/web-images
# Install mc client
curl "https://dl.min.io/client/mc/release/linux-amd64/mc" --create-dirs -o /usr/local/bin/mc
chmod +x /usr/local/bin/mc
# Start minio server
minio server /data --console-address :9001
# Set an alias for mc client
# sleep 5
# mc alias set minio $MINIO_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD
# echo "adding event notifications"
# Add event amqp notification when a json, csv or xlsx file is uploaded to these buckets
# mc event add minio/landing-zone arn:minio:sqs::primary:amqp --event put --suffix .json --suffix .csv --suffix .xlsx
# mc event add minio/raw-zone arn:minio:sqs::primary:amqp --event put --suffix .json --suffix .csv --suffix .xlsx
# mc event add minio/trusted-zone arn:minio:sqs::primary:amqp --event put --suffix .json --suffix .csv --suffix .xlsx
# mc event add minio/refined-zone arn:minio:sqs::primary:amqp --event put --suffix .json --suffix .csv --suffix .xlsx
