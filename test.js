/*var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBNmXtV61112WJDnpctz8jBKc_ByTiUUf4'
});

// Geocode an address.
googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
  if (!err) {
    console.log(response.json.results);
  }
});
*/
let apiKey = '6d597adf5b2e9548c15a8d856286086b';
let city = 'buffalo';
let url = `http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&units=imperial&appid=${apiKey}`
const request = require('request');
request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body)
    let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
    console.log(message);
  }
});
