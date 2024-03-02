import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 19.295549695930685, lng: 72.86792628283874 };

const showCurrentLocation = () => {
  console.log("here");
  if (navigator.geolocation) {
    // Get the current position of the user
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat1 = position.coords.latitude;
        var lng1 = position.coords.longitude;
        console.log(lat1, lng1);
        return;
      },
      (error) => {
        // Handle any errors
        console.log(error);
      }
    );
  } else {
    // Display a message if the geolocation API is not supported
    alert("Geolocation is not supported by this browser.");
  }
};

function findParkingSpaces(lat, lng) {
  // Create an empty array to store the results
  let parkingSpaces = [];
  // Make a request to the Google Maps Places API with the nearbysearch parameter
  fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=public+parking+corporation+near+me&key=AIzaSyAO3GoOjZBzRIM359y4BVxkxr5NINamDxE`
  )
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      // Loop through the results and push each parking space to the array
      for (let item of data.results) {
        parkingSpaces.push({
          name: item.name, // The name of the parking space
          address: item.vicinity, // The address of the parking space
          distance: item.distance, // The distance from the coordinates in meters
          //availability: item.opening_hours.open_now, // The availability of the parking space
        });
      }
      console.log(parkingSpaces);
      // Return the array of parking spaces
      return parkingSpaces;
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });
}

const Oome = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAO3GoOjZBzRIM359y4BVxkxr5NINamDxE",
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    console.log("Calculating");
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);

    var dist_for_api = results.routes[0].legs[0].distance.text;
    var dura_for_api = results.routes[0].legs[0].duration.text;
    console.log(dist_for_api, dura_for_api);
  }
  function on_click_calc() {
    calculateRoute();
    showCurrentLocation();
    findParkingSpaces(18.648061, 73.7595417);
  }
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={on_click_calc}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          />
        </HStack>
      </Box>
    </Flex>
  );
};

export default Oome;
