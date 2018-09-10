// content of index.js
let apiKey = '6d597adf5b2e9548c15a8d856286086b';
let url = `http://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=${apiKey}`
const request = require('request');


function getWeatherInCity(city)
{

  return new Promise(function(resolve, reject) {
  req_url = url+`&q=${city}`

  console.log(req_url)
  request(req_url, function (err, response, body) {
    if(err){
      console.log('ERROR:', error);
      reject(err)
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
var cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (request, response) => {
  response.send('Hello from Express!')
})
app.post('/submit', (request, response) => {
  var temp
  let weather_promise =  getWeatherInCity(request.query.city)
  weather_promise.then(function(result){
    temp = result
  console.log('--'+temp)
  response.send('Its '+ temp + ' in ' +request.query.city)
  },function(err) {
        console.log(err);
    })
  weather_promise.catch(function(error) {
  console.log(error);
});
})


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
