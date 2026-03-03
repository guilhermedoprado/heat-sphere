FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia os projetos primeiro
COPY ["HeatSphere.Api/HeatSphere.Api.csproj", "HeatSphere.Api/"]
COPY ["HeatSphere.Application/HeatSphere.Application.csproj", "HeatSphere.Application/"]
COPY ["HeatSphere.Domain/HeatSphere.Domain.csproj", "HeatSphere.Domain/"]
COPY ["HeatSphere.Infrastructure/HeatSphere.Infrastructure.csproj", "HeatSphere.Infrastructure/"]

# Copia o resto do código
COPY . .

# Limpa sujeiras antes de fazer o restore (Isso mata o MSB3552 na raiz)
RUN find . -name "bin" -type d -exec rm -rf {} + \
    && find . -name "obj" -type d -exec rm -rf {} +

RUN dotnet restore "HeatSphere.Api/HeatSphere.Api.csproj"

WORKDIR "/src/HeatSphere.Api"
RUN dotnet publish "HeatSphere.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "HeatSphere.Api.dll"]
