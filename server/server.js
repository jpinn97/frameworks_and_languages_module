const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());  // bodyParser middleware to consume JSON post

const ITEMS = [
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



app.post('/item', (req,res) => {
    console.log("Post to items")
    // res.json(ITEMS)
    console.log(req.body)
    ITEMS.push(req.body)
    res.status(201).json(req.body)
  })







app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });


// Docker container exit handler - https://github.com/nodejs/node/issues/4182
process.on('SIGINT', function() {process.exit()})