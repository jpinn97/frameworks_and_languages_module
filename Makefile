_DOCKER_COMPOSE:=USER=$(shell id -u):$(shell id -g) docker compose
DOCKER_COMPOSE:=${_DOCKER_COMPOSE} --file docker-compose.yml
DOCKER_COMPOSE_EXAMPLE:=${DOCKER_COMPOSE} --file docker-compose.example.server.yml --file docker-compose.example.client.yml
DOCKER_COMPOSE_TEST:=${DOCKER_COMPOSE} --file docker-compose.cypress.yml --file docker-compose.test.yml
DOCKER_COMPOSE_EXAMPLE_TEST:=${DOCKER_COMPOSE_EXAMPLE} --file docker-compose.cypress.yml --file docker-compose.test.yml

.PHONY: help
.DEFAULT_GOAL:=help
help:	## display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[.a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-8s\033[0m %s\n", $$1, $$2 } END{print ""}' $(MAKEFILE_LIST)
	# deafult server port 8000
	# default client port 8001

.PHONY: run custom_client run run_example_server_client run example_server test_server test_client test_example_server test_example_client cypress cypress_cmd

run:  ##
	${DOCKER_COMPOSE} up --build
run_example_server_client:  ## run example server and client containers
	${DOCKER_COMPOSE_EXAMPLE} up --build
	# visit http://localhost:8001?api=http://localhost:8000
run_example_server:  ##
	${DOCKER_COMPOSE} --file docker-compose.example.server.yml up --build server
		## run --rm server /bin/sh

#test:  ##
#	${DOCKER_COMPOSE_TEST} up --build
#	${DOCKER_COMPOSE_TEST} down
test_server:  ##
	${DOCKER_COMPOSE_TEST} up --build test_server
	${DOCKER_COMPOSE_TEST} down
test_client:  ##
	${DOCKER_COMPOSE_TEST} up --build test_client
	${DOCKER_COMPOSE_TEST} down

#test_example:  ##
#	${DOCKER_COMPOSE_EXAMPLE_TEST} up
#	${DOCKER_COMPOSE_EXAMPLE_TEST} down
test_example_server:  ##
	${DOCKER_COMPOSE_EXAMPLE_TEST} up --build test_server
	${DOCKER_COMPOSE_EXAMPLE_TEST} down
test_example_client:  ##
	${DOCKER_COMPOSE_EXAMPLE_TEST} up --build test_client
	${DOCKER_COMPOSE_EXAMPLE_TEST} down

cypress_gui:  ## Launch local cypress from container (requires an XServer and DISPLAY env)
	${DOCKER_COMPOSE_EXAMPLE_TEST} run --rm --env DISPLAY test_client open --project . --e2e --browser electron 
	${DOCKER_COMPOSE_EXAMPLE_TEST} down
cypress_cmd:
	# Use with `CYPRESS_CMD="stuff" make cypress_cmd`
	${_DOCKER_COMPOSE} --file docker-compose.cypress.yml \
		run --rm test_client \
			${CYPRESS_CMD}


# Combine 

run_example_client_with_your_server:  ##
	${DOCKER_COMPOSE} --file docker-compose.example.client.yml up --build
	${DOCKER_COMPOSE} --file docker-compose.example.client.yml down
run_your_client_with_example_server:  ##
	${DOCKER_COMPOSE} --file docker-compose.example.server.yml up --build
	${DOCKER_COMPOSE} --file docker-compose.example.server.yml down
test_your_client_with_example_server:  ##
	${DOCKER_COMPOSE_TEST} --file docker-compose.example.server.yml up --build test_client
	${DOCKER_COMPOSE_TEST} down
test_example_client_with_your_server:  ##
	${DOCKER_COMPOSE_TEST} --file docker-compose.example.client.yml up --build test_client
	${DOCKER_COMPOSE_TEST} down


openapi.html:  ## build openapi html
	docker run --rm -v "$$PWD:/spec" -u $(id -u):$(id -g) redocly/cli \
		build-docs openapi.yaml -o openapi.html
technical_report.pdf:  ## build pdf version of technical_report.md
	docker run --rm -v "$$PWD:/data" -u $(id -u):$(id -g) pandoc/latex \
		technical_report.md -o technical_report.pdf
