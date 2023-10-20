DOCKER_IMAGE:=freecycle-inc_server

build:
	docker build --tag ${DOCKER_IMAGE} .

run:
	docker run --rm -it --publish 8000:8000 ${DOCKER_IMAGE}

all: build run