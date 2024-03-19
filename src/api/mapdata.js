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
function findParkingSpaces(lat, lng) {
    let parkingSpaces = [];
    let key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    console.log('key',key);
    fetch(`http://localhost:5000/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=public+parking+corporation+near+me&key=${key}`)
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      // Loop through the results and push each parking space to the array
      for (let item of data.results) {
        parkingSpaces.push({
          name: item.name, // The name of the parking space
          address: item.vicinity, // The address of the parking space
        });
      }
      //console.log(parkingSpaces);
      // Return the array of parking spaces
      return parkingSpaces;
    })
    
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });
    return parkingSpaces;
}
export { showCurrentLocation, findParkingSpaces, setCenter }