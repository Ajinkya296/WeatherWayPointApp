function CapitlizeString(word)
{
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function round(num,dec)
{
  d = Math.pow(10, dec)
  return Math.round(num*d)/d
}

function addtoDOMlist(city,icon){
  var ch = document.getElementById("cities").innerHTML = "Cities on route";
  var ul = document.getElementById("list");
  var li = document.createElement("li");
  var elem = document.createElement("img");
  var div_elem = document.createElement("div");
  elem.src = icon;
  elem.setAttribute("style" ,  " float:right; height:50; width:50")

  div_elem.appendChild(document.createTextNode(city));
  div_elem.appendChild(elem)
  item = city + elem
  li.appendChild(div_elem);
  li.setAttribute("class", "list-group-item"); 
  li.setAttribute("style", "background-color:#f1f2f6; color: #495057;font-size: 1.25em ;  padding: 0.5rem 0.5rem;");
  ul.appendChild(li);
}

function resetDOMlist(){
  var ch = document.getElementById("cities").innerHTML = "";
  var ul = document.getElementById("list");
  ul.innerHTML = ''
}


/*
Returns temp,wind,weather_summary,description,city for a particular lat,lon
*/
function weather_latlon(lat,lon)
{
  var temperature
  var wind
  var wind_dir
  var weather_desc
  var city
  url = "http://127.0.0.1:3000/weather_latlon?" + "lat=" +lat + "&lon=" +lon

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", url, false);
  xhttp.send()
  response = JSON.parse(xhttp.responseText)
  temperature = response.main.temp
  wind  = response.wind
  city  = response.name
  weather_summ =  response.weather[0].main
  weather_desc =  response.weather[0].description

  return {temperature,wind,weather_summ,weather_desc,city}
}

function render_weather(waypoints)
{

  var icons = {
  clear       :  'weather_icons/clear.svg',
  low_cloudy  :  'weather_icons/cloudy-day-1.svg',
  high_cloudy :  'weather_icons/cloudy-day-3.svg',
  light_rain  :  'weather_icons/rainy-4.svg',
  heavy_rain  :  'weather_icons/rainy-7.svg',
  snow        :  'weather_icons/snow.svg',
  fog         :  'weather_icons/fog.svg',
  hazy        :  'weather_icons/hazy.svg',
  thunder     :  'weather_icons/thunder.svg'
  } 
  weather_info = []
  
  for(i = 0 ; i < waypoints.length;i++)
  {
    lat = round(waypoints[i].lat(),2 )
    lon = round(waypoints[i].lng(),2 )

    weather_info[i] =   weather_latlon(lat,lon)

    //------------------Set icons wrt weather descriptions----------------
    if(weather_info[i].weather_desc.includes('thunder'))
      weather_info[i].icon = icons.thunder
    else if (weather_info[i].weather_desc.includes('mist'))
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
    //------------------------------------------------------------------------
      setTimeout(addtoDOMlist(weather_info[i].city,weather_info[i].icon),50)

  }

  //------------Add marker and weather infowindow for every waypoint---------------- 
  for(i = 0 ; i < waypoints.length;i++)
  {
    var waypoint = waypoints[i]
    var marker = new google.maps.Marker({
          position: waypoint,
          icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
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


      var contentString ='<div id="content" style= " margin-left : -2px ;overflow:hidden;display:inline-block;">'+
                            '<div style= " margin-left : 5px">'+
                              '<p style="font-size:20px;">'+ weather_info[i].city +' </p>'+
                            '</div>' +
                            '<img src=" '+ weather_info[i].icon +'" style= " float:left;" height="40" width="40"> '+
                            '<div style="display:inline-block;">'+
                              '<span style = "font-size: 1.25em ;">'+ weather_info[i].temperature  +'<sup>o</sup> F &nbsp'+ CapitlizeString(weather_info[i].weather_desc) +' </span></br>'+
                              '<span  style = "font-size: 1.25em ;"> Wind '+ round(weather_info[i].wind.speed * (25/11),1) +' miles/hr </span>'+
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




var bounds = new google.maps.LatLngBounds();
var polyline
var markers

function render_route(response,map)
{
  //------------Reset previous rendering-------------
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
  //---------------------------------------------------


  //----------------Empty response check--------------
  if(response.data.status == "ZERO_RESULTS")
  {
    alert("Sorry! No road routues found.")
    return
  }
  //---------------------------------------------------



  //------------------Rendering route polyline ---------------

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
  });
  polyline.setMap(map);

  //---------------------------------------------------



  //----------------------Getting Waypoints Info----------------
  /* Every 12.5% point is chosen to be a waypoint and its weather info is extracted*/

  waypoints = []
  markers   = []
  address   = []
  interval =  parseInt(path.length/8)
  for(i=0;i<path.length;i+=interval)
  {
    waypoints.push(path[i])
  }
  waypoints.push(path[path.length-1])
  weather_info = []
  render_weather(waypoints)

  //---------------------------------------------------
}

/*
1. Asynchronously submits source and destination values to server to get route between them from server
    If no response comes back that mean there was a spelling error
2. Renders the route on the map from response of server
*/

function submit_points()
{
      var start = new Date().getTime();
      url = "http://127.0.0.1:3000/route?" + "source=" +document.getElementById("origin").value + "&dest="  +document.getElementById("dest").value
      axios.post(url).then(response => {
                                        if(response.data=="")
                                           {
                                            alert("Check your source and destination spelling")
                                           }     
                                        else {
                                              resetDOMlist()
                                              render_route(response,map) 
                                              var end = new Date().getTime();
                                              var time = end - start;
                                              console.log('Execution time: ' + time/1000 +" seconds");
                                            }   
                                      }); 

}

