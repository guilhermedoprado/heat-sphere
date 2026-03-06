FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia tudo de uma vez — necessário porque o SDK 10.0.103 avalia globs
# (**/*.cs, **/*.resx) durante o restore e salva literais no obj/ quando
# os arquivos fonte ainda não existem, corrompendo o build subsequente.
COPY . .

RUN dotnet publish "HeatSphere.Api/HeatSphere.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "HeatSphere.Api.dll"]
