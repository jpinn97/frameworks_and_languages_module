

## Vue.js Client Application for FreeCycle



### Introduction
This is a Vue.js client application for the FreeCycle platform. It allows users to manage items by creating, viewing, and deleting them. The application uses Vue.js for its frontend, and connects to an Express.js server for backend operations.

### Features
- Interface for item management with create, view, and delete functionalities.
- Integration with an Express.js server via RESTful API.
- Dynamic UI updates using Vue.js reactivity system.
- Styled with Tailwind CSS for a modern look and feel.


### Prerequisites
- Node.js (v16 or above)
- Docker (for containerized deployment)


### Installation

#### Clone the repository and navigate to the client directory

git clone: https://github.com/aromeni/frameworks_and_languages_module.git
 and cd [your-client-directory]


## Running the Application

### Local Development
To run the application locally

npm install
npm run serve


This will start the Vue.js application on http://localhost:8080


### Using Docker
Build and run the application using Docker


- make build
- make run


This will build a Docker image and run it on port 8001.

### Usage
To use the application, navigate to http://localhost:8001 in your browser. The application provides a form to create new items and a list view to see all created items. Each item can be deleted using the delete button.

### Adding Server Domain
For the client to interact with the server, add the server domain as a query parameter to the URL, e.g., http://localhost:8001?api=http://your-server-domain.

### Dockerfile Explanation
The Dockerfile sets up a Node.js environment, installs http-server globally for serving the client, copies the client code into the container, and exposes the port 8001 for the client to run on.


### Makefile Usage
The Makefile simplifies Docker commands:

- make build to build the Docker image.
- make run to run the Docker container.

### License
N/A

### Author
Abdul Rashid Omeni