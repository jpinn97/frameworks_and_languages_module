# Define the Docker image name
IMAGE_NAME=client_independent_react_app

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
	docker run -p 8001:8001 -d $(IMAGE_NAME)

# # Stop and remove the running Docker container
# stop:
#     docker stop $$(docker ps -q --filter ancestor=$(IMAGE_NAME))
#     docker rm $$(docker ps -a -q --filter ancestor=$(IMAGE_NAME))

# # Remove the Docker image
# clean:
#      docker rmi $(IMAGE_NAME)

# # Shortcut to build and run
# all: build run
