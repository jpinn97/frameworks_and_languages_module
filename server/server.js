const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());  // bodyParser middleware to consume JSON post

// enabling all Cors Request
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
      "image": "https://placekitten.com/200/300",
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




let currentId = 1;  // Counter for unique IDs

app.post('/item', (req, res) => {
  const requiredFields = ['user_id', 'keywords', 'description', 'lat', 'lon'];

  // Check if all required fields are present in the request body
  if (!requiredFields.every(field => req.body.hasOwnProperty(field))) {
    return res.status(405).json({"Message": "Missing fields...Please investigate"});
  }

  const timestamp = new Date().toISOString();

  // Generate a unique ID, current timestamp, and add the request body fields
  const newItem = {
    id: currentId++,
    ...req.body,               //  adds user_id, keywords, description, lat, lon, and optionally image
    date_from: timestamp,
    date_to: timestamp
    
  };

  ITEMS.push(newItem);
  res.status(201).json(newItem);
});



  app.delete('/item/:id', (req,res) => {
    ITEMS = ITEMS.filter((item) => item.id != req.params.id)
    res.status(204).json() 
  })





app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });


// Docker container exit handler - https://github.com/nodejs/node/issues/4182
process.on('SIGINT', function() {process.exit()})