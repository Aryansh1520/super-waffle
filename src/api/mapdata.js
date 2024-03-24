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

  const date = new Date();
  const dayOfWeek = date.getDay() + 1;
  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var time = `${hours}${minutes}`;
  time = parseInt(time)

  // Loop through the results
  for (let item of data.results) {
    // Create a DirectionsRequest object
    if (item.rating === undefined) {
      continue;}

    var request = {
      origin: { lat: lat, lng: lng },
      destination: { lat: item.geometry.location.lat, lng: item.geometry.location.lng },
      travelMode: 'DRIVING'
    };

    // Make a request to the Directions API
    directionsService.route(request, async function(result, status) {
      if (status === 'OK') {

        const user_data = {
          "Day of the week": dayOfWeek,
          "Time of day": time,
          "Amenity type": 2,
          "Distance to amenity": result.routes[0].legs[0].distance.value,
          'User rating of parking': item.rating,
          "Handicap accessible": 1
        }

        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user_data)
        });
        const fare = await response.json();
        // Push the parking space and the duration to the array
        parkingSpaces.push({
          user_latitude : lat,
          user_longitude : lng,
          name: item.name,
          address: item.vicinity,
          latitude: item.geometry.location.lat,
          longitude: item.geometry.location.lng,
          distance: result.routes[0].legs[0].distance.text,
          duration: result.routes[0].legs[0].duration.text,
          rating: item.rating,
          fare: fare // assuming the server returns the fare directly
        });
      }
    });
  }

  console.log(parkingSpaces);
  return parkingSpaces;
}



export { showCurrentLocation, findParkingSpaces }