# Cheatsheet de Comandos — Heat Sphere

Referência rápida dos principais comandos para setup, build, deploy e manutenção do projeto.

---

## Docker

### Setup & Build
```bash
# Build de todos os serviços
docker compose build

# Build de um serviço específico
docker compose build go_service
docker compose build csharp_api
docker compose build frontend

# Build sem cache (força rebuild completo)
docker compose build --no-cache
```

### Execução
```bash
# Subir todos os serviços
docker compose up -d

# Subir em modo foreground (ver logs)
docker compose up

# Subir apenas alguns serviços
docker compose up -d go_service postgres_db
```

### Logs & Status
```bash
# Ver logs de todos os serviços
docker compose logs -f

# Logs de um serviço específico
docker compose logs -f go_service

# Status dos containers
docker compose ps
```

### Parar & Remover
```bash
# Parar todos os serviços
docker compose down

# Parar e remover volumes
docker compose down -v

# Remover imagens órfãs
docker compose down --rmi local
```

### Outros
```bash
# Executar comando dentro de um container
docker compose exec go_service sh
docker compose exec postgres_db psql -U postgres -d heatspheredb

# Rebuild e subir
docker compose up -d --build
```

---

## Git / GitHub

### Setup
```bash
# Clonar repositório
git clone <url-do-repo>
cd heat-sphere

# Configurar usuário (primeira vez)
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

### Branch & Commit
```bash
# Criar e trocar de branch
git checkout -b feature/minha-feature

# Status e diff
git status
git diff

# Adicionar e commitar
git add .
git add arquivo.go
git commit -m "feat: descrição da alteração"

# Push
git push origin main
git push -u origin feature/minha-feature
```

### Sincronizar
```bash
# Atualizar do remoto
git pull origin main

# Fetch e merge
git fetch origin
git merge origin/main
```

### Desfazer & Limpar
```bash
# Descartar alterações em arquivo
git checkout -- arquivo.go

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Remover arquivos não rastreados
git clean -fd
```

---

## NPM / Node.js

### Setup
```bash
# Instalar dependências
npm install

# Instalar dependência de produção
npm install react

# Instalar dependência de desenvolvimento
npm install -D vite typescript
```

### Scripts & Build
```bash
# Rodar script definido no package.json
npm run dev
npm run build
npm run preview

# Build de produção
npm run build
```

### Pacotes
```bash
# Listar pacotes instalados
npm list
npm list --depth=0

# Atualizar pacotes
npm update

# Remover pacote
npm uninstall nome-do-pacote

# Limpar cache
npm cache clean --force
```

### Outros
```bash
# Verificar vulnerabilidades
npm audit
npm audit fix

# Inicializar novo projeto
npm init -y
```

---

## Go

### Setup
```bash
# Inicializar módulo
go mod init heatsphere/go_service

# Baixar dependências
go mod tidy
go mod download
```

### Build & Run
```bash
# Rodar aplicação
go run ./cmd/server/main.go

# Build
go build -o bin/server ./cmd/server

# Build para Linux (cross-compile)
GOOS=linux GOARCH=amd64 go build -o bin/server ./cmd/server
```

### Pacotes & Dependências
```bash
# Adicionar dependência
go get github.com/go-chi/chi/v5

# Atualizar dependência
go get -u github.com/go-chi/chi/v5

# Remover dependências não usadas
go mod tidy

# Verificar módulos
go mod verify
```

### Testes & Ferramentas
```bash
# Rodar testes
go test ./...

# Testes com coverage
go test -cover ./...

# Formatar código
go fmt ./...
goimports -w .

# Lint
golangci-lint run
```

---

## ASP.NET / .NET

### Setup
```bash
# Criar novo projeto
dotnet new webapi -n HeatSphere.Api

# Restaurar pacotes
dotnet restore
```

### Build & Run
```bash
# Rodar aplicação
dotnet run --project backend/HeatSphere.Api

# Build
dotnet build backend/HeatSphere.Api

# Build de release
dotnet publish backend/HeatSphere.Api -c Release -o ./publish
```

### Pacotes
```bash
# Adicionar pacote
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# Listar pacotes
dotnet list package

# Atualizar pacote
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.0

# Remover pacote
dotnet remove package NomeDoPacote
```

### Testes & Ferramentas
```bash
# Rodar testes
dotnet test

# Formatar código
dotnet format
```

---

## PostgreSQL

### Conexão via CLI
```bash
# Conectar ao banco (local)
psql -U postgres -d heatspheredb

# Via Docker
docker compose exec postgres_db psql -U postgres -d heatspheredb
```

### Comandos úteis (dentro do psql)
```sql
-- Listar tabelas
\dt

-- Descrever tabela
\d nome_tabela

-- Listar bancos
\l

-- Sair
\q
```

---

## Estrutura do Projeto Heat Sphere

| Serviço      | Porta | Descrição                    |
|-------------|-------|------------------------------|
| Gateway     | 8080  | Nginx (proxy reverso)        |
| Go Service  | 8000  | Microsserviço de cálculos    |
| C# API      | 5000  | Backend principal            |
| PostgreSQL  | 5432  | Banco de dados               |
| Frontend    | 5173  | React + Vite                 |

### Quick Start
```bash
# 1. Subir tudo
docker compose up -d --build

# 2. Acessar
# Frontend: http://localhost:5173
# API via Gateway: http://localhost:8080
```
