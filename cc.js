function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.7041, lng: 77.1025},
    zoom: 10,
    mapTypeId: 'roadmap'
  });
	var locations = [
  {lat: 28.5306, lng: 77.2808},
  {lat: 28.874, lng: 77.29},
  {lat: 28.402, lng: 77.31},
  {lat: 28.941, lng: 77.85},
  {lat: 28.34, lng: 77.25},
  {lat: 28.7041, lng: 77.106},
  {lat: 28.7041, lng: 77},
]
	// Create an array of alphabetical characters used to label the markers.
  function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var service = locations.map(function(location, i) {
    var mrkr= new google.maps.Marker({
      icon : {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'red',
          fillOpacity: .2,
          scale: Math.pow(2, 5) / 2,
          strokeColor: 'white',
          strokeWeight: .5
      } ,
      map:map,
      position: location,
      label: labels[i % labels.length]
    });
			mrkr.addListener('click', function() {
                        map.setZoom(9);
                        post('https://developers.myoperator.co/clickOcall', {token:'7e0b8e28d0885495c2fa3163eec4fdf2',      customer_number:8956317787,customer_cc:91,support_user_id:'mustansir'});

                        
                        });
    return mrkr;    
  });

 // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(map, service,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  var destinationA;
  var destinationIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=D|FF0000|000000';
  var originIcon = 'https://chart.googleapis.com/chart?' +
      'chst=d_map_pin_letter&chld=O|FFFF00|000000';
       var geocoder = new google.maps.Geocoder;
  
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    var markersArray = [];

    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
				var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();
        destinationA = {lat:latitude,lng:longitude};
        bounds.union(place.geometry.viewport);
        var service = new google.maps.DistanceMatrixService;
  	service.getDistanceMatrix({
    origins: locations,
    destinations: [destinationA],
    travelMode: 'DRIVING',
     drivingOptions: {
    departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
    trafficModel: 'pessimistic',
  },
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function(response, status) {
    if (status !== 'OK') {
      alert('Error was: ' + status);
    } else {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
      var outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '';

      var showGeocodedAddressOnMap = function(asDestination) {
        var icon = asDestination ? destinationIcon : originIcon;
        return function(results, status) {
          if (status === 'OK') {
            map.fitBounds(bounds.extend(results[0].geometry.location));
            markersArray.push(new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: icon
            }));
          } else {
            alert('Geocode was not successful due to: ' + status);
          }
        };
      };

      for (var i = 0; i < originList.length; i++) {
        var results = response.rows[i].elements;
        geocoder.geocode({'address': originList[i]},
            showGeocodedAddressOnMap(false));
        for (var j = 0; j < results.length; j++) {
          geocoder.geocode({'address': destinationList[j]},
              showGeocodedAddressOnMap(true));
          outputDiv.innerHTML += 'supplier no.'+(i+1)+' : <br>'+ originList[i] + '<br> to <br> ' + destinationList[j] +
              ': <br> ' + results[j].distance.text + '<br> in ' +
              results[j].duration.text + '<br>'+'************** <br>';
        }
      }
    }
  });
      } else {
        bounds.extend(place.geometry.location);
      }
    });
  map.fitBounds(bounds);
  });
  }
  
  