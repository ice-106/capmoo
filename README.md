## Getting Started

Install dependencies

```sh
pnpm install
```

Create .env

```sh
cp .env.example .env
```

### Web

Start the Web development server

```sh
pnpm dev --filter @capmoo/web
```

### API

To fix Go environment problems on Windows.

```sh
go env -w GOMODCACHE=$HOME/go/pkg/mod
go env -w GOCACHE=$HOME/AppData/Local/go-build
```

Install Go modules

```sh
cd ./apps/api
go mod download
```

Start the local database.

```sh
docker compose up
```

Start the API development server

```sh
pnpm dev --filter @capmoo/api
```
