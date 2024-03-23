import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

var center = {};

function setCenter(latitude, longitude){ 
  console.log('Entered function')
  console.log(typeof(latitude));
  center['lat']=latitude;
  center['lng']=longitude;
  return center;

}

function showCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => reject(error)
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}
async function findParkingSpaces(lat, lng) {
  let parkingSpaces = [];
  let key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  console.log('key',key);
  var park_properties;
  const response = await fetch(`http://localhost:5000/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=public+parking+corporation+near+me&key=${key}`);
  const data = await response.json();

  // Create a DirectionsService object
  var directionsService = new window.google.maps.DirectionsService();

  // Loop through the results
  for (let item of data.results) {
    // Create a DirectionsRequest object
    var request = {
      origin: { lat: lat, lng: lng },
      destination: { lat: item.geometry.location.lat, lng: item.geometry.location.lng },
      travelMode: 'DRIVING'
    };

    // Make a request to the Directions API
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        // Push the parking space and the duration to the array
        parkingSpaces.push({
          name: item.name,
          address: item.vicinity,
          latitude: item.geometry.location.lat,
          longitude: item.geometry.location.lng,
          distance: result.routes[0].legs[0].distance.text,
          duration: result.routes[0].legs[0].duration.text
        });
      }
    });
  }


  console.log(parkingSpaces);
  return parkingSpaces;
}




export { showCurrentLocation, findParkingSpaces }