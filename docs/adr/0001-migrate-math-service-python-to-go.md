# ADR 0001: Migrar microserviço de cálculos de Python para Go

## Status

Aceito (2026-03-06)

## Contexto

O HeatSphere possui um microserviço de cálculos termodinâmicos (LMTD, Churchill-Bernstein para fluxo externo em cilindro) originalmente implementado em Python com FastAPI. A decisão de migrar para Go foi tomada considerando:

- **Mercado DACH**: Go é amplamente valorizado na Alemanha, Áustria e Suíça para microserviços
- **Performance**: Cálculos numéricos se beneficiam da compilação nativa
- **Portfolio**: Demonstrar versatilidade (ASP.NET Core + Go)
- **Aprendizado**: Go é uma linguagem estratégica para a carreira do autor

## Decisão

Migrar o `py_service` para `go_service`, mantendo:

- Mesmos endpoints e contratos JSON (compatibilidade com o frontend)
- Mesma lógica de domínio (LMTD, correção F, Churchill-Bernstein)
- Mesma tabela de propriedades do ar (37 pontos, 100K–3000K)
- Mesmo container name (`heatsphere_math_service`) para o Nginx não precisar de alteração

## Consequências

### Positivas

- Binário estático ~10MB (vs imagem Python ~150MB)
- Startup mais rápido
- Type safety em tempo de compilação
- Stack alinhado ao mercado DACH

### Negativas

- Código Python original permanece no repositório (`py_service/`) para referência histórica — pode ser removido após validação em produção

### Neutras

- O `py_service` pode ser mantido como fallback temporário alterando o `docker-compose.yml`

## Stack técnico

- **Router**: chi/v5 (leve, idiomático)
- **JSON**: encoding/json (stdlib)
- **UUID**: github.com/google/uuid
- **Build**: multi-stage Docker (golang:1.22-alpine → alpine:3.19)
