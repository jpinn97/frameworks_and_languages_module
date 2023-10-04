# Use the latest base image with Go preinstalled
FROM golang:1.21.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the local code to the container's working directory
COPY . .

# Build the Go application
RUN go build -o main.go .

# Expose a port (if your Go application listens on a specific port)
EXPOSE 8000

# Command to run the Go application
CMD ["./main.go"]