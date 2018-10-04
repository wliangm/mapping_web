
// perform an API call to the USGS API to get last 7 days of all earthquakes information. Call createCircle when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createCircle);

function createCircle(response) {

  // pull the "earthquake" property off of response.features
  var incidents = response.features;

  // initialize an array to hold earthquake incidents
  var incidentCircle = [];

  // loop through the incidents array
  for (var index = 0; index < incidents.length; index++) {
    var eachIncident = incidents[index];

    //define color cicle based on the size of magnitude 
    if (eachIncident.properties.mag < 1){
      circleColor = "green"
    } else if (eachIncident.properties.mag >= 1 && eachIncident.properties.mag < 2){
      circleColor = "yellow"
    } else if (eachIncident.properties.mag >= 2 && eachIncident.properties.mag < 3){
      circleColor = "orange"
    } else if (eachIncident.properties.mag >= 3 && eachIncident.properties.mag < 4){
      circleColor = "red"
    } else if (eachIncident.properties.mag >= 4 && eachIncident.properties.mag < 5){
      circleColor = "magenta"
    } else {
      circleColor = "purple"
    }

    // for each earthquake incident, create a circle marker and bind a popup with magnitude and place
    var locationCircle = L.circleMarker([eachIncident.geometry.coordinates[1],eachIncident.geometry.coordinates[0]],
    {
      fillOpacity: .6,
      color: "black",
      fillColor: circleColor ,
      weight: 1,
      radius: (eachIncident.properties.mag)*5
    }).bindPopup("<h3>Magnitude: " + eachIncident.properties.mag+ "<h3><h3>Location: " + eachIncident.properties.place + "<h3>");

    // add the marker to the earthquake incidents array
    incidentCircle.push(locationCircle);
  };

  // create a layer group made from the incidents markers array, pass it into the createMap function
  createMap(L.layerGroup(incidentCircle));
}

function createMap(earthquakes) {

  // create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [lightmap, earthquakes]
  });

  // create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // set up the legend in the lower right of the map
  var legend = L.control({position: 'bottomright'});
    
  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0,1,2,3,4,5];
          colors = ["green","yellow","orange","red","magenta","purple"];
          div.innerHTML = '<h3>Earthquake Magnitude</h3>'

      // loop through grade array and generate legend label for each color according to magnitude grades
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class="legend" style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '++');
    }
    return div;
  };
  
  legend.addTo(map);

};

 
