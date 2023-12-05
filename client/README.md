# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



## Client-Side Application for Item Management

This application is a React-based client-side interface for managing items. It allows users to create, view, and delete items, each with details such as user ID, location coordinates, an image, keywords, and a description.


## Features

- Create new items with details including user ID, latitude, longitude, image URL, keywords, and description.
- View a list of created items.
- Delete items from the list.
- Fetch and display items from a remote API.



## Getting Started

### CRUD with React and Vite 

## Prerequisites
- Node.js and npm (Node Package Manager)
- Git (for cloning the repository)

### Installation

Clone the repository:
git clone https://github.com/aromeni/frameworks_and_languages_module.git

Navigate to the project directory:
cd client

Install dependencies:
npm install

Start the development server:
npm run dev


The application will be running at http://localhost:8001/


## Technologies 

- React.js for building the user interface.
- Tailwind CSS for styling.
- Vite as the build tool and development server.
- Docker for containerization.


### Running the Application with Docker

#### Build the Docker image
- make build
#### Run the Docker container:
- make run
#### Run Test:
- make test_client





Access the application at http://localhost:8001/.

### Version: V1.0

### Author
Abdul Rashid Omeni


### License
Not under any license.


