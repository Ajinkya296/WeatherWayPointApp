// content of index.js
let apiKey = '6d597adf5b2e9548c15a8d856286086b';
let url = `http://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=${apiKey}`
const request = require('request');


function getWeatherInCity(city)
{

  return new Promise(function(resolve, reject) {
  request(url+`&q=${city}`, async function (err, response, body) {
    if(err){
      reject(err)
      console.log('error:', error);
    }
    else {
      let weather = JSON.parse(body)
      let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
      let info    =  weather.main.temp;
      resolve(info)
    }
  })
})
}


const express = require('express')
var bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})
app.post('/submit', (request, response) => {
  var temp
  let weather_promise =  getWeatherInCity(request.body.city)
  weather_promise.then(function(result){
    temp = result
  console.log('--'+temp)
  response.send('Its '+ temp + ' in ' +request.body.city)
  },function(err) {
        console.log(err);
    })
})


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
