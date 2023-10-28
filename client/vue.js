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


app.delete('/item/:id', (req, res) => {
  const itemId = req.params.id; 
  console.log('Received delete request for ID:', itemId);
  console.log('Attempting to delete item with ID:', itemId);
  console.log('Current items:', items);

  const itemIndex = items.findIndex(item => item.id.toString() === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Item not found!' });
  }

  items.splice(itemIndex, 1);
  res.json({ status: 'success', message: `Item with ID ${itemId} deleted!` });
});



app.listen(port, () => {
  console.log(`Vue app listening on port ${port}`)
})






