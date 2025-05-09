# Build stage
FROM golang:1.24 AS builder

# Set the working directory
WORKDIR /build

# Copy dependency files first to leverage Docker cache
COPY go.mod go.sum ./

# Download Go module dependencies
RUN go mod download

# Copy the rest of the source code
COPY . ./

# Build only the main binary (assumes main.go is in ./cmd/api)
RUN mkdir -p dist && go build -trimpath -ldflags="-s -w" -o dist/api ./cmd/api

# Runtime stage
FROM debian:bookworm-slim

# Copy binary from builder stage
COPY --from=builder /build/dist/api /usr/local/bin/api

# Run the binary
