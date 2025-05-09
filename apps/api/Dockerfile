FROM golang:1.24 AS builder

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . ./

RUN mkdir -p dist && go build -trimpath -ldflags="-s -w" -o dist/api ./cmd/api

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /build/dist/api /usr/local/bin/api

ENTRYPOINT ["api"]
    