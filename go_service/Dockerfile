FROM golang:1.22-alpine AS build
WORKDIR /app

COPY go.mod ./
COPY . .
RUN go mod tidy && CGO_ENABLED=0 go build -o /math-service ./cmd/server

FROM alpine:3.19
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=build /math-service .
EXPOSE 8000
ENV PORT=8000
CMD ["./math-service"]
