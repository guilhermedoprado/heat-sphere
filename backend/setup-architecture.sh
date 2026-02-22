#!/bin/bash

# .SYNOPSIS
#     Script Bash para criar estrutura de pastas Clean Architecture e Projetos de Teste
# .DESCRIPTION
#     Cria a Solution, Projetos de Teste (xUnit) e a hierarquia de pastas internas para 
#     Domain, Application, Infrastructure e API, sem criar os projetos principais.

PROJECT_NAME="HeatSphere"

# Cores para o output no terminal Linux
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
DARK_GRAY='\033[1;30m'
NC='\033[0m' # No Color

echo -e "${CYAN}Iniciando criação da estrutura para ${PROJECT_NAME}...${NC}"

# --- 0. CRIAÇÃO DA SOLUTION E PROJETOS DE TESTE ---
echo -e "\n${YELLOW}[1/3] Criando Solution e Projetos de Teste (xUnit)...${NC}"

# Cria a Solution se não existir
if [ ! -f "${PROJECT_NAME}.sln" ]; then
    dotnet new sln -n "${PROJECT_NAME}" > /dev/null
    echo -e "  ${GREEN}+ Solution criada${NC}"
fi

# Cria os projetos de teste na pasta tests/
dotnet new xunit -n "${PROJECT_NAME}.UnitTests" -o "tests/${PROJECT_NAME}.UnitTests" > /dev/null
dotnet new xunit -n "${PROJECT_NAME}.IntegrationTests" -o "tests/${PROJECT_NAME}.IntegrationTests" > /dev/null
dotnet new xunit -n "${PROJECT_NAME}.ArchitectureTests" -o "tests/${PROJECT_NAME}.ArchitectureTests" > /dev/null

# Adiciona os projetos de teste na Solution
dotnet sln add "tests/${PROJECT_NAME}.UnitTests/${PROJECT_NAME}.UnitTests.csproj" > /dev/null
dotnet sln add "tests/${PROJECT_NAME}.IntegrationTests/${PROJECT_NAME}.IntegrationTests.csproj" > /dev/null
dotnet sln add "tests/${PROJECT_NAME}.ArchitectureTests/${PROJECT_NAME}.ArchitectureTests.csproj" > /dev/null

# --- 1. MAPEAMENTO DE PASTAS POR CAMADA ---
echo -e "\n${YELLOW}[2/3] Criando hierarquia de pastas internas...${NC}"

# Função auxiliar para criar pasta e adicionar .gitkeep
create_folder() {
    local base_path=$1
    local sub_folder=$2
    local full_path="${base_path}/${sub_folder}"
    
    # Converte as barras do Windows (\) para barras do Linux (/)
    full_path="${full_path//\\//}"
    
    if [ ! -d "$full_path" ]; then
        mkdir -p "$full_path"
        echo -e "  ${GREEN}+ Criado: ${base_path}/${sub_folder}${NC}"
        touch "${full_path}/.gitkeep"
    fi
}

# DOMAIN
DOMAIN_PATH="${PROJECT_NAME}.Domain"
DOMAIN_FOLDERS=(
    "Aggregates" "Common" "Entities" "Enums" "Events" "Exceptions" "Interfaces" "ValueObjects"
)

# APPLICATION
APP_PATH="${PROJECT_NAME}.Application"
APP_FOLDERS=(
    "Common/Behaviors" "Common/Interfaces" "Common/Exceptions"
    "UseCases/Users/Commands/CreateUser"
    "UseCases/Users/Commands/UpdateUser"
    "UseCases/Users/Queries/GetUserById"
    "UseCases/Users/Events"
    "UseCases/Auth/Commands/Login"
)

# INFRASTRUCTURE
INFRA_PATH="${PROJECT_NAME}.Infrastructure"
INFRA_FOLDERS=(
    "BackgroundJobs" "Caching" "Identity"
    "Persistence/Contexts" "Persistence/Repositories"
    "Persistence/Configurations" "Persistence/Migrations"
    "Services"
)

# API
API_PATH="${PROJECT_NAME}.Api"
API_FOLDERS=(
    "Controllers" "Middlewares" "Extensions" "Filters" "Services"
)

# Array associativo não é tão simples no bash antigo, então iteramos sobre as listas
for folder in "${DOMAIN_FOLDERS[@]}"; do create_folder "$DOMAIN_PATH" "$folder"; done
for folder in "${APP_FOLDERS[@]}"; do create_folder "$APP_PATH" "$folder"; done
for folder in "${INFRA_FOLDERS[@]}"; do create_folder "$INFRA_PATH" "$folder"; done
for folder in "${API_FOLDERS[@]}"; do create_folder "$API_PATH" "$folder"; done

echo -e "\n${CYAN}[3/3] Estrutura finalizada com sucesso! 🚀${NC}"
echo -e "${DARK_GRAY}A solution e os projetos de teste foram criados.${NC}"
