#!/bin/bash
# Testa se o gateway consegue alcançar os backends.
# Rode: docker compose run --rm gateway sh -c "apk add --no-cache curl && ./test.sh"
# Ou manualmente no Portainer: Exec no container heatsphere_gateway e rode:
#   apk add --no-cache curl
#   curl -s -o /dev/null -w "%{http_code}" http://go_service:8000/
#   curl -s -o /dev/null -w "%{http_code}" http://csharp_api:8080/

echo "=== Teste de conectividade (rode dentro do container gateway) ==="
echo ""
echo "1. Resolvendo go_service..."
getent hosts go_service || nslookup go_service 2>/dev/null || echo "FALHOU: go_service não resolve"
echo ""
echo "2. Resolvendo csharp_api..."
getent hosts csharp_api || nslookup csharp_api 2>/dev/null || echo "FALHOU: csharp_api não resolve"
echo ""
echo "3. Testando go_service:8000..."
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST http://go_service:8000/api/external-flow/cylinder/calculate \
  -H "Content-Type: application/json" \
  -d '{"name":"T","diameter":0.1,"velocity":5,"fluid_temperature":300,"surface_temperature":350}' || echo "FALHOU"
echo ""
echo "4. Testando csharp_api:8080..."
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://csharp_api:8080/swagger/index.html || echo "FALHOU"
