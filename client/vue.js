const express = require('express')
const app = express()
var cors = require('cors')
const port = 8000;


app.use(cors())
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.get('/', (req, res) => {
  res.sendFile('client.html', {root: __dirname})
})

app.listen(port, () => {
  console.log(`Vue app listening on port ${port}`)
})

