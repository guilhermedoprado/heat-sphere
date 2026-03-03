FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# 1. Copia os arquivos de projeto
COPY ["HeatSphere.Api/HeatSphere.Api.csproj", "HeatSphere.Api/"]
COPY ["HeatSphere.Application/HeatSphere.Application.csproj", "HeatSphere.Application/"]
COPY ["HeatSphere.Domain/HeatSphere.Domain.csproj", "HeatSphere.Domain/"]
COPY ["HeatSphere.Infrastructure/HeatSphere.Infrastructure.csproj", "HeatSphere.Infrastructure/"]

# 2. Restaura as dependências PRIMEIRO
RUN dotnet restore "HeatSphere.Api/HeatSphere.Api.csproj"

# 3. Agora copia O RESTO DO CÓDIGO FONTE, pasta por pasta
COPY ["HeatSphere.Api/", "HeatSphere.Api/"]
COPY ["HeatSphere.Application/", "HeatSphere.Application/"]
COPY ["HeatSphere.Domain/", "HeatSphere.Domain/"]
COPY ["HeatSphere.Infrastructure/", "HeatSphere.Infrastructure/"]

# 4. Compila a aplicação
WORKDIR "/src/HeatSphere.Api"
RUN dotnet publish "HeatSphere.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 5. Gera a imagem final de produção
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "HeatSphere.Api.dll"]
