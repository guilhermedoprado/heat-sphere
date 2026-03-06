# Checklist Portainer — HeatSphere

## Problema: 502 Bad Gateway ou "Temperature out of range or calculation failed"

O 502 significa que o gateway/proxy **não consegue** alcançar o `go_service`. O frontend mostra a mensagem genérica para qualquer falha de rede.

---

## 1. Rede explícita

O `docker-compose.yml` usa a rede `heatsphere_net` para todos os serviços. No Portainer, ao fazer deploy, certifique-se de que a stack está completa e todos os containers foram criados.

---

## 2. Teste de conectividade (no Portainer)

**Console** do container `heatsphere_gateway`:

```bash
# Instalar curl (Alpine)
apk add --no-cache curl

# Testar se go_service resolve e responde
curl -X POST http://go_service:8000/api/external-flow/cylinder/calculate \
  -H "Content-Type: application/json" \
  -d '{"name":"T","diameter":0.1,"velocity":5,"fluid_temperature":300,"surface_temperature":350}'
```

- **JSON com reynolds, nusselt** → rede OK, o problema é outro.
- **"could not resolve host"** → `go_service` não está na mesma rede.
- **"connection refused"** → `go_service` não está rodando ou porta errada.

---

## 3. Nome do serviço no Portainer

No Portainer, o nome do container pode ser `heatsphere_math_service`, mas o **hostname na rede** é `go_service` (nome do serviço no compose). O gateway usa `go_service:8000`.

Se o deploy no Portainer usar um **nome de stack** diferente, o hostname pode virar `heatsphere_go_service` ou similar. Nesse caso, edite o `default.dev.conf` e troque `go_service` pelo hostname que aparecer no teste de conectividade.

---

## 4. Rebuild completo

Após alterar o compose ou configs:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

## 5. npm run dev (local)

Quando roda `npm run dev` no seu PC, o proxy do Vite usa `localhost:8080` (gateway). O gateway precisa estar rodando:

```bash
docker compose up -d gateway go_service csharp_api postgres_db
```
