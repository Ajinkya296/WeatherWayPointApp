// content of index.js
let weatherapiKey = '6d597adf5b2e9548c15a8d856286086b';
let mapapiKey     =  'AIzaSyBNmXtV61112WJDnpctz8jBKc_ByTiUUf4 '
let weather_url = `http://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=${weatherapiKey}`
let map_url     = `https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyBNmXtV61112WJDnpctz8jBKc_ByTiUUf4`
const request = require('request');


function getWeatherInCity(city)
{

  return new Promise(function(resolve, reject) {
  req_url = weather_url+`&q=${city}`

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

function getWeatherInLatLon(latitude,longitude)
{

  return new Promise(function(resolve, reject) {
  req_url = weather_url+`&lat=${latitude}`+`&lon=${longitude}`
  console.log(req_url)
  request(req_url, function (err, response, body) {
    if(err){
      console.log('ERROR:', error);
      reject(err)
    }
    else {
      let weather_response = JSON.parse(body)
      let info    = weather_response;
      resolve(info)
    }
  })
})
}

function getRouteAtoB(ptA, ptB)
{

  return new Promise(function(resolve, reject) {
  req_url = map_url+`&origin=${ptA}&destination=${ptB}`

  request(req_url, function (err, response, body) {
    if(err){
      console.log('ERROR:', error);
      reject(err)
    }
    else {
      resolve(body)
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

app.post('/weather_city', (request, response) => {
  var temp
  let weather_promise =  getWeatherInCity(request.query.city)
  console.log(request)
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
app.post('/weather_latlon', (request, response) => {
  var temp
  let weather_promise =  getWeatherInLatLon(request.query.lat,request.query.lon)
  //console.log(request)
  weather_promise.then(function(result){
    temp = result
  console.log('--'+temp)
  response.send(result)
  },function(err) {
        console.log(err);
    })
  weather_promise.catch(function(error) {
  console.log(error);
});
})

app.post('/route', (request, response) => {
  let map_promise =  getRouteAtoB(request.query.A , request.query.B)
  map_promise.then(function(result){
  response.send(result)
  },function(err) {
        console.log(err);
    })
  map_promise.catch(function(error) {
  console.log(error);
});
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
