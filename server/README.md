# Freecycle-inc Server and Client

Description

This is a technical proposal for Freecycle-inc's Server and Client. The server is wrote in Golang, and uses the Gin framework to build a RESTful api for the backend implementation of this project. The Client frontend uses primarily React, aswell as Javascript, Typescript and Tailwind CSS. It is bundled together with the Vite framework.

## Prerequisites

The supported method of launching is by using Make and Docker:

### Make

```bash
sudo apt-get install build-essential
```

### Docker

1. Visit the Docker website and download the appropriate Docker Desktop installer for your operating system.
2. Run the installer and follow the prompts to install Docker Desktop.
3. After installation, you can verify the installation by opening a terminal and running `docker --version`.

### Node.js and npm

Using a Package Manager:

The process varies slightly depending on the Linux distribution.
For Debian and Ubuntu-based distributions, you can use the following commands:

```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

For other distributions, refer to the package manager and the Node.js documentation for the specific installation method.

Verify the Installation:

```bash
Open Terminal.
Run node -v to check the Node.js version.
Run npm -v to check the npm version.
```

You may have to restart your shell/and or computer.

## Installation

Clone the repository and move to either the server or client directory:

```bash
git clone https://github.com/jpinn97/frameworks_and_languages_module
cd server # or client
make build
```

## Usage

From the root directory:

```bash
cd server # or client
make run
```

### Server

The server will be running on the host machine at `localhost:8000`. Please see the openapi.yaml file for the api specification, endpoints and request/response schemas.

### Client

The client will be running on the host machine at `localhost:8001`. The client is a single page application, and will be served by the server. Usage of the client can be found as according to the specification in the openapi.yaml file.

Adding valid information into the form and clicking submit will send a request to the server adding the item. The client will then update the page with the new item.

Clicking the delete button on a list item will send a request to the server to delete the item. The client will then update the page with the updated list of items.

## Testing

From the root directory:

```bash
make test_client # to test server and client together.

make test_server # to test server against example implementation client.

make test_client # to test client against example implementation server.
```
