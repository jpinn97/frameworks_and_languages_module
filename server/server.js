const express = require('express');
const app = express();
const port = 8000;


// // Serve Hello World! on '/'
// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })


// Serve HTML on '/'
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
  });
  




app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });


// Docker container exit handler - https://github.com/nodejs/node/issues/4182
process.on('SIGINT', function() {process.exit()})