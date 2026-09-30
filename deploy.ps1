$berkas = @("-f", "docker-compose.yml", "-f", "docker-compose.deploy.yml")
docker compose @berkas up -d --pull always
if (-not $?) { exit 1 }
docker compose @berkas ps
