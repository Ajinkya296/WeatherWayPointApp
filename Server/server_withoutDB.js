// content of index.js
let weatherapiKey = '6d597adf5b2e9548c15a8d856286086b';
let mapapiKey     =  'AIzaSyBNmXtV61112WJDnpctz8jBKc_ByTiUUf4 '
let weather_url = `http://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=${weatherapiKey}`
let map_url     = `https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyBNmXtV61112WJDnpctz8jBKc_ByTiUUf4`
let geocode_url = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBNmXtV61112WJDnpctz8jBKc_ByTiUUf4`
const request = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


function encodeLatLon(pointA,pointB)
{

  lat_A = pointA.lat
  lng_A = pointA.lng
  lat_B = pointB.lat
  lng_B = pointB.lng
  enc = "" + lat_A + "|" + lng_A + "|" +  lat_B + "|" +lng_B
  return enc
}

function getWeatherInLatLon(latitude,longitude)
{

  return new Promise(function(resolve, reject) {
    req_url = weather_url+`&lat=${latitude}`+`&lon=${longitude}`
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
    req_url = map_url+`&origin=${ptA.lat},${ptA.lng}&destination=${ptB.lat},${ptB.lng}`

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

const express = require('express');
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

app.post('/rev_geocode', (request, response) => {
  var temp
  // Print the HTML for the Google homepage.
  rev_geocode_url = geocode_url   + '&latlng=' +  request.query.lat + ',' +  request.query.lon + '&result_type=administrative_area_level_2|locality '
  //console.log(rev_geocode_url)

  
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", rev_geocode_url, false);
  xhttp.send()
  geocode_response = JSON.parse(xhttp.responseText)
  addr = geocode_response.results[0]
  response.send(addr)
})


app.post('/weather_latlon', (request, response) => {
  var temp
  // Print the HTML for the Google homepage.
  let weather_promise =  getWeatherInLatLon(request.query.lat,request.query.lon)
  //console.log(request)
  weather_promise.then(function(result){
    temp = result
    response.send(result)
  },function(err) {
    console.log(err);
  })
  weather_promise.catch(function(error) {
    console.log(error);
  });
})

app.post('/route', (req, response) => {

  src_url = geocode_url   + '&address=' +  req.query.source
  dest_url = geocode_url  + '&address=' +  req.query.dest
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", src_url, false);
  xhttp.send()

  src_response = JSON.parse(xhttp.responseText)
  if(src_response.status != "ZERO_RESULTS"){
  src_point = src_response.results[0].geometry.location
  }
  else
  {
    response.send(undefined)  
    return
  }

  xhttp.open("POST", dest_url, false);
  xhttp.send()
  dest_response = JSON.parse(xhttp.responseText)
  if(dest_response.status != "ZERO_RESULTS"){
  dest_point = dest_response.results[0].geometry.location
}
  else
  {
    response.send(undefined)  
    return
  }
  console.log("source : "+src_point + "source : "+dest_point)

  let map_promise =  getRouteAtoB(src_point, dest_point)
  map_promise.then(function(result){
    response.send(result)
  },function(err) {
    console.log(err);
  })
  map_promise.catch(function(error) {
    console.log(error);
  })
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)})
