FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY *.sln .
COPY *.csproj .
RUN dotnet restore MissingLink.Api.sln

COPY . .
RUN dotnet publish MissingLink.Api.sln -c release --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app ./
EXPOSE 5002
ENTRYPOINT ["dotnet", "./bin/Release/net10.0/missinglink.dll"]
