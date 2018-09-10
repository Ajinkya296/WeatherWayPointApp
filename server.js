// content of index.js
let apiKey = '6d597adf5b2e9548c15a8d856286086b';
let url = `http://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=${apiKey}`
const request = require('request');


function getWeatherInCity(city)
{
  var info
  request(url+`&q=${city}`, function (err, response, body) {
    if(err){
      console.log('error:', error);
    }
    else {
      let weather = JSON.parse(body)
      let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
      info    = weather.main.temp;

    }
  });
console.log(info)
return info
}


const express = require('express')
var bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})
app.post('/submit',async (request, response) => {
  let temp = await getWeatherInCity(request.body.city)
  console.log('--'+temp)
  response.send('Its'+ temp + ' in ' +request.body.city)
})
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
