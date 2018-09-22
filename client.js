function submit_city()
{
  console.log("Clicked")
  url = "http://127.0.0.1:3000/submit?" + "city=" +document.getElementById("city").value
  axios.post(url).then(response => console.log(response.data));
}
function CapitlizeString(word)
{
    return word.charAt(0).toUpperCase() + word.slice(1);
}
function round(num,dec)
{
  d = Math.pow(10, dec)
  return Math.round(num*d)/d
}
function weather_latlon(lat,lon)
{
  var temperature
  var wind
  var wind_dir
  var weather_desc
  url = "http://127.0.0.1:3000/weather_latlon?" + "lat=" +lat + "&lon=" +lon

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", url, false);
  xhttp.send()
  response = JSON.parse(xhttp.responseText)
  temperature = response.main.temp
  wind  = response.wind
  weather_summ =  response.weather[0].main
  weather_desc =  response.weather[0].description
  return {temperature,wind,weather_summ,weather_desc}
  /*
  return  axios.post(url).then( response => {
                                    return response.data//
                                  });
  console.log({temperature,wind,weather_desc})
*/
}

var bounds = new google.maps.LatLngBounds();
var polyline
var markers
function render_route(response,map)
{

  if(polyline != undefined)
  {
    console.log("Removed")
    polyline.setMap(null);
  }
  if(markers != undefined)
  {
    for(i = 0 ; i < markers.length ; i++)
    {
      if (markers[i] != undefined)
        markers[i].setMap(null)
    }
  }
  var lat
  var lng
  jsonData =  response.data.routes[0].overview_polyline
  var path = google.maps.geometry.encoding.decodePath(jsonData.points);
  for (var i = 0; i < path.length; i++) {
    bounds.extend(path[i]);
  }
  map.panTo(path[0])
  map.fitBounds(bounds);
  polyline = new google.maps.Polyline({
    path: path,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map
      // strokeColor: "#0000FF",
      // strokeOpacity: 1.0,
      // strokeWeight: 2
  });
  polyline.setMap(map);

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
  {
    origins: [path[0]],
    destinations: [path[path.length-1]],
    travelMode: 'DRIVING'
  }, callback);

function callback(response, status) {
  document.getElementById("result").innerHTML = "Distance is " + response.rows[0].elements[0].distance.text + "\n" + "Time required " + response.rows[0].elements[0].duration.text
}
  //---------------------- Splitting waypoints----------

  var icons = {
  clear       :  'weather_icons/clear.svg',
  low_cloudy  :  'weather_icons/cloudy-day-1.svg',
  high_cloudy :  'weather_icons/cloudy-day-3.svg',
  light_rain  :  'weather_icons/rainy-4.svg',
  heavy_rain  :  'weather_icons/rainy-7.svg',
  snow        :  'weather_icons/snow.svg',
  fog         :  'weather_icons/fog.svg',
  hazy        :  'weather_icons/hazy.svg'
  }


  waypoints = []
  markers   = []
  interval =  parseInt(path.length/4)
  for(i=0;i<path.length;i+=interval)
  {
    waypoints.push(path[i])
  }
  waypoints.push(path[path.length-1])
  weather_info = []
  for(i = 0 ; i < waypoints.length;i++)
  {
    lat = round(waypoints[i].lat(),2 )
    lon = round(waypoints[i].lng(),2 )

    weather_info[i] =   weather_latlon(lat,lon)
    if (weather_info[i].weather_desc.includes('mist'))
      weather_info[i].icon = icons.fog
    else if (weather_info[i].weather_desc.includes('haze'))
        weather_info[i].icon = icons.hazy
    else if (weather_info[i].weather_desc.includes('cloud'))
        if (weather_info[i].weather_desc.includes('overcast') )
          weather_info[i].icon = icons.high_cloudy
        else {
          weather_info[i].icon = icons.low_cloudy
        }
    else if (weather_info[i].weather_desc.includes('rain'))
        if (weather_info[i].weather_desc.includes('light') )
          weather_info[i].icon = icons.light_rain
        else {
          weather_info[i].icon = icons.heavy_rain
        }
    else {
      weather_info[i].icon = icons.clear
    }
    console.log(weather_info[i])
  }
  console.log(weather_info)
  for(i = 0 ; i < waypoints.length;i++)
  {
    var waypoint = waypoints[i]

    var marker = new google.maps.Marker({
          position: waypoint,
          icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: 'yellow',
    fillOpacity: 0.8,
    strokeColor: 'blue',
    strokeWeight: 2
    },
          draggable: false,
          label: '',
          map: map
        }

      );
      var contentString =   '<div id="content" style= " margin-left : -2px ;overflow:hidden;display:inline-block;">'+
           '<img src=" '+ weather_info[i].icon +'" style= " float:left;" height="32" width="32"> '+
           '<div style="display:inline-block;">'+
                '<span>'+ weather_info[i].temperature  +'<sup>o</sup> C '+ CapitlizeString(weather_info[i].weather_desc) +' </span></br>'+
                '<span> Wind '+ round(weather_info[i].wind.speed * (25/11),1) +' miles/hr </span>'+
            '</div>' +
           '</div>'

      var infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){
                    return function() {
                    infowindow.setContent(contentString);
                    infowindow.open(map,marker);
                  };
                })(marker,contentString,infowindow));
      google.maps.event.addListener(marker,'dblclick', (function(marker,contentString,infowindow){
                    return function() {
                    infowindow.close();
                  };
                })(marker,contentString,infowindow));
        markers.push(marker)
    }
}

function submit_points()
{
      //initialize()
      console.log("Clicked")
      url = "http://127.0.0.1:3000/route?" + "source=" +document.getElementById("origin").value + "&dest="  +document.getElementById("dest").value
      axios.post(url).then(response =>  render_route(response,map));

}
/*
function initMap() {
  var pointA = new google.maps.LatLng(51.7519, -1.2578),
    pointB = new google.maps.LatLng(50.8429, -0.1313),
    myOptions = {
      zoom: 7,
      center: pointA
    },
    map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService,
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    }),
    markerA = new google.maps.Marker({
      position: pointA,
      title: "point A",
      label: "A",
      map: map
    }),
    markerB = new google.maps.Marker({
      position: pointB,
      title: "point B",
      label: "B",
      map: map
    });

  // get route from A to B
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

}



function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
  directionsService.route({
    origin: pointA,
    destination: pointB,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

initMap();
*/
function test()
{
  console.log("works")
}
