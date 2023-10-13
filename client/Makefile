# Define variables
DOCKER_IMAGE_NAME := freecycle-inc_client
DOCKER_BUILD_CONTEXT := .
DOCKERFILE := Dockerfile

# Build the Docker image
build:
	docker build -t $(DOCKER_IMAGE_NAME) -f $(DOCKERFILE) $(DOCKER_BUILD_CONTEXT)

# Run the Docker container
run:
	docker run -p 8001:8001 $(DOCKER_IMAGE_NAME)

# Clean up (remove the Docker image and containers)
clean:
	docker stop $(DOCKER_IMAGE_NAME) || true
	docker rm $(DOCKER_IMAGE_NAME) || true
	docker rmi $(DOCKER_IMAGE_NAME) || true

# Default target to build and run the Docker container
all: build run
