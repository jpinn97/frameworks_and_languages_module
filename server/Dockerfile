# Use the latest base image with Go preinstalled
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the Go binary into the container
COPY freecycle-inc_server /app/freecycle-inc_server

# Expose a port of the Go application to listens on a specific port
EXPOSE 8080

# Define the command to run your Go application
CMD ["/app/freecycle-inc_server"]
