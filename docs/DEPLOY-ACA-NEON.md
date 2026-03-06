# Deploy HeatSphere — ACA + Neon

## Resumo das alterações (2026-03-06)

- **Python removido** — Todo o `py_service` foi deletado. O serviço de cálculos agora é 100% Go.
- **Container app `heatsphere-python`** — Continua com o mesmo nome, mas passa a rodar a **imagem Go** (`heatsphere-go`).
- **405 corrigido** — O frontend agora usa `baseURL` do axios com `VITE_API_URL`, apontando para o gateway.

## GitHub Secrets obrigatórios

| Secret | Descrição |
|-------|-----------|
| `VITE_API_URL` | URL pública do **gateway** (ex: `https://heatsphere-gateway.whitefield-dc96e279.brazilsouth.azurecontainerapps.io`) |
| `ACR_LOGIN_SERVER` | Servidor do Azure Container Registry |
| `ACR_USERNAME` | Usuário do ACR |
| `ACR_PASSWORD` | Senha do ACR |
| `AZURE_CREDENTIALS` | JSON de service principal para `az login` |

**Importante:** Sem `VITE_API_URL` correto, o frontend faz as chamadas para o próprio host e retorna 405.

## C# (Neon)

O `ConnectionStrings__DefaultConnection` deve apontar para o Neon. Configure no ambiente do container app `heatsphere-csharp` no portal Azure:

```
ConnectionStrings__DefaultConnection=postgresql://user:pass@host/db?sslmode=require
```

## Fluxo

1. Frontend (browser) → `VITE_API_URL` (gateway) → `/api/*`
2. Gateway (nginx) → roteia para `heatsphere-csharp` ou `heatsphere-python`
3. `heatsphere-python` → roda **imagem Go** (cálculos)
4. `heatsphere-csharp` → roda C# (notes, auth, productivity) + Neon

## Testar localmente

```bash
docker compose up -d gateway go_service csharp_api postgres_db
# Frontend: npm run dev (usa proxy do Vite para localhost:8080)
```
