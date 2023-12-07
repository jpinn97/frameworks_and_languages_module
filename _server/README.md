
# Express Server for Item Management

### Introduction
This project is an Express.js server application designed for managing a collection of items. It provides endpoints for creating, retrieving, and deleting items, each with unique identifiers and associated details.

### Features

### RESTful API for item management.
- Middleware for handling JSON requests and CORS.
- Error handling for invalid JSON formats.
- Endpoints for listing, retrieving, creating, and deleting items.
### Prerequisites
Node.js (v16 or above)
Docker (for containerized deployment)


### Installation
Clone the repository and install dependencies:

git clone [your-repo-url]
cd [your-repo-directory]
npm install


### Running the Server
Run the server using Node.js:

npm start

The server will start on http://localhost:8000


### Using Docker
#### Build and run the server using Docker:
- make build
- make run


## API Endpoints

#### Get All Items
- URL: /items
- Method: GET
####  Single Item
- URL: /item/:id
- Method: GET
### Create New Item
- URL: /item
- Method: POST
- Body:
{
  "user_id": "user123",
  "keywords": ["item1", "item2"],
  "description": "Item description",
  "lat": 51.2798438,
  "lon": 1.0830275
}

### Delete Item
- URL: /item/:id
- Method: DELETE
- License:
 N/A

#### Author
ABADUL RASHID OMENI