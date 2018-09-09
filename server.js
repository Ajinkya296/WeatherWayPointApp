// content of index.js



const express = require('express')
var bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})
app.post('/submit',(request, response) => {
  response.send('Server recieved : ' + request.body.firstname + '  ' + request.body.lastname )
})
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
