const express = require('express'); // Import Express framework to create a web server
const app = express(); // Initialize an Express application
const port = 8000; // Set the port number for the server to listen on

app.use(express.json());  // bodyParser middleware to consume JSON post


// Error handling middleware for express.json()
app.use((err, req, res, next) => {
   // Handles JSON parsing errors by sending a 405 response if the request body contains invalid JSON.
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(405).send('Invalid JSON format or missing fields');
  } else {
    next();
  }
});


// Importing CORS middleware and enabling it for all routes in the Express app
const cors = require('cors');
app.use(cors());


let ITEMS = [
    {
      "id": 0,
      "user_id": "user1234",
      "keywords": [
        "hammer",
        "nails",
        "tools"
      ],
      "description": "A hammer and nails set",
      "image": "https://picsum.photos/150",
      "lat": 51.2798438,
      "lon": 1.0830275,
      "date_from": "2023-10-16T22:50:40.567Z",
      "date_to": "2023-10-16T22:50:40.567Z"
    }
  ]

// // Serve Hello World! on '/'
// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })


// Serve HTML on '/'
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
  });
  

// Serve JSON on '/items'
app.get('/items', (req,res)=>{
    res.json(ITEMS)
  })

// Serve JSON on '/item/id'
app.get('/item/:id', (req, res) => {
  const item = ITEMS.find(i => i.id == req.params.id);
  if (item) {
      res.status(200).json(item);  
  } else {
      res.status(404).json({ message: 'Item not found' });
    }
});

let currentId = 1;  // Counter for unique IDs

app.post('/item', (req, res) => {
  const requiredFields = ['user_id', 'keywords', 'description', 'lat', 'lon'];

  // Check if all required fields are present in the request body
  // Validates that all required fields are present in the request body.
  if (!requiredFields.every(field => req.body.hasOwnProperty(field))) {
    return res.status(405).json({"Message": "Missing fields...Please investigate"});
  }
  
  // Adds a unique ID, current timestamp, and combines them with the request body's fields.
  const timestamp = new Date().toISOString();

  // Generate a unique ID, current timestamp, and add the request body fields
  const newItem = {
    id: currentId++,
    ...req.body,               // using spread operator, adds user_id, keywords, description, lat, lon, and optionally image
    date_from: timestamp,
    date_to: timestamp
    
  };

  ITEMS.push(newItem);
  res.status(201).json(newItem);
});



  // app.delete('/item/:id', (req,res) => {
  //   ITEMS = ITEMS.filter((item) => item.id != req.params.id)
  //   res.status(204).json() 
  // })

//  DELETE route handler for '/item/:id' to delete an item by its ID.
  app.delete('/item/:id', (req, res) => {

    // Extract the item ID from the request parameters.
    const itemId = req.params.id;
    
    // Check if the item exists
    const itemExists = ITEMS.some(item => item.id == itemId);
    
    if (!itemExists) {
        return res.status(404).json({ message: "Item not found" });
    }
    // Filter out the item with the given ID from the ITEMS array, effectively deleting it
    // Remove the item from the ITEMS array
    ITEMS = ITEMS.filter((item) => item.id != itemId);
    
    // Return a 204 (No Content) status to indicate successful deletion without sending any content
    return res.status(204).json();
});




// Route to handle GET requests for '/items' with optional query parameters.
app.get('/items', (req, res) => {
  // Extract query parameters from the request.
  const query = req.query;

  // Filter the items array based on the query parameters.
  const filteredItems = items.filter(item => {
      // Each condition returns false if the item does not meet the criteria, effectively filtering it out.
      if (query.user_id && item.user_id !== query.user_id) return false;
      if (query.keyword && !item.keywords.some(kw => query.keyword.split(',').includes(kw))) return false;
      if (query.lon && query.lat && (item.lon !== query.lon || item.lat !== query.lat)) return false;
      if (query.date_from && new Date(item.date_from) < new Date(query.date_from)) return false;
      return true; // If none of the conditions are met, the item passes all filters.
  });

  // Send the filtered list of items as a JSON response.
  res.json(filteredItems);
});

// Start the Express server on the specified port.
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });


// Docker container exit handler - https://github.com/nodejs/node/issues/4182
process.on('SIGINT', function() {process.exit()})