FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY *.sln .
COPY *.csproj .
RUN dotnet restore MissingLink.Api.sln

COPY . .
RUN dotnet publish MissingLink.Api.sln -c release --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
EXPOSE 5002
ENTRYPOINT ["dotnet", "./bin/Release/net8.0/missinglink.dll"]