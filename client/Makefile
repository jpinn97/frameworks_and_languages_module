
DOCKER_IMAGE_CLIENT:=my-client

build:
	docker build --tag ${DOCKER_IMAGE_CLIENT} .

run:
	docker run --rm -it --publish 8001:8001 ${DOCKER_IMAGE_CLIENT}
