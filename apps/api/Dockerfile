FROM golang:1.24 AS builder

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . ./

RUN mkdir -p dist && go build -o dist ./...

FROM debian:bookworm-slim

COPY --from=builder /build/dist/api /usr/local/bin/api

ENTRYPOINT [ "api" ]