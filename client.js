function submit_city()
{
  console.log("Clicked")
  url = "http://127.0.0.1:3000/submit?" + "city=" +document.getElementById("city").value
  axios.post(url).then(response => console.log(response.data));
}

var bounds = new google.maps.LatLngBounds();

var polyline

function render_route(response,map)
{

  if(polyline != undefined)
  {
    console.log("Removed")
    polyline.setMap(null);
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
}

function submit_points()
{
      //initialize()
      console.log("Clicked")
      url = "http://127.0.0.1:3000/route?" + "A=" +document.getElementById("origin").value + "&B=" +document.getElementById("dest").value

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
