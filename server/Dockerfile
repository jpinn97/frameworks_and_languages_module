# Build stage
FROM golang:1.21.4-alpine as builder
WORKDIR /build
COPY . ./
RUN go mod download

# Statically linked binary, so we can run it in a scratch container with no external dependencies, target Linux
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ./main .

# Final minimal container using empty scratch image
FROM scratch
WORKDIR /app
COPY --from=builder /build/main ./
EXPOSE 8000
ENTRYPOINT ["./main"]
