const express = require('express')
const app = express()
var cors = require('cors')
const port = 8000;

app.use(express.json());
app.use(cors())


let items = [];

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.get('/', (req, res) => {
  res.sendFile('client.html', {root: __dirname})
})



app.post('/item', (req, res) => {
  const item = req.body;
  console.log('Received item:', item);

  //item.id = Date.now();; // Using timestamp as a simple unique ID for this example.

 items.push(item); // Store the new item in the items array
  console.log('Received item again:', item);
  res.json({ status: 'success', item });
});


app.get('/items', (req, res) => {
  res.json(items); // sends the items array as a JSON response
});





app.listen(port, () => {
  console.log(`Vue app listening on port ${port}`)
})






