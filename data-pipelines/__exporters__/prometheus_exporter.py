from prometheus_client import start_http_server

if __name__ == '__main__':
  print("Starting Prometheus exporter")
  start_http_server(9091)
  print("Prometheus exporter started")
  while True:
    pass