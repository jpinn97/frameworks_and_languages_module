<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description



## Server-Side Application with NestJS
This server-side application is built using NestJS, a progressive Node.js framework. It provides a robust backend structure for managing items, with functionalities for creating, retrieving, updating, and deleting item data.

### Features
- RESTful API endpoints for item management (create, read, update, delete).
- Validation and transformation of request data using NestJS pipes.
- Global exception handling for a consistent error response format.
- CORS enabled for cross-origin requests.


## Getting Started


### Prerequisites
- Node.js (v16 or later)
- npm (Node Package Manager)
- Docker (optional for containerized setup) 

### Installation

Clone the repository:
git clone https://github.com/aromeni/frameworks_and_languages_module.git

Navigate to the project directory:
cd server

Install dependencies:
npm install

Start the development server:
npm run start:dev


The application will be running at http://localhost:8000/


## Technologies 

This application is built using the following technologies:

- NestJS: For the main application framework, providing a scalable architecture.
- Node.js: As the runtime environment for executing JavaScript code server-side.
- TypeScript: Used for writing the application code, enhancing code quality and maintainability.
- Docker: For containerizing the application, ensuring consistency across various environments.
- Express.js: The underlying library for NestJS, handling HTTP requests and responses.
Jest: For unit and integration testing of the application.
- ESLint & Prettier: Used for code linting and formatting to maintain code quality and consistency.

- Makefile: A build automation tool used to simplify Docker commands and other build steps.

### Containerization and Automation
- Dockerfile: Defines the steps for containerizing the application, creating a consistent and isolated environment for development and deployment.
- Makefile: Used to automate common Docker commands, making it easier to build and run the Docker container.


### Running the Application with Docker

#### Build the Docker image
- make build
#### Run the Docker container:
- make run
#### Run Test:
- make test_server





Access the application at http://localhost:8000/.

### Version: V1.0

### Author
Abdul Rashid Omeni


### License
Not under any license.



