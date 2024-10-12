FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY *.sln .
COPY *.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c release --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
EXPOSE 5002
ENTRYPOINT ["dotnet", "./bin/release/net8.0/missinglink.dll"]