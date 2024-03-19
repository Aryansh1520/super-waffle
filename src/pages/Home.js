import React from "react";


import {showCurrentLocation,findParkingSpaces} from "../api/mapdata.js";
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
import { useEffect,useRef, useState } from "react";
import Table1 from '../components/dyn_tab'




const Home = () => {
  const [data, setData] = useState([]); // state variable to store fetched data
  const [showTable, setShowTable] = useState(false); // state variable to control visibility of DataTable



  const [center, setCenter] = useState();

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        const location = await showCurrentLocation();
        console.log('here', location);
        setCenter(location);
      } catch (error) {
        console.error(error);
      }
    }

    getCurrentLocation();
  }, []);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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

  if (!isLoaded || !center ) {

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
  async function on_click_calc() {
    calculateRoute();
    showCurrentLocation();
    const fetchedData = await findParkingSpaces(18.648061, 73.7595417); // add await here
    //console.log("haine?",fetchedData);
    setData(fetchedData);
    setShowTable(true);
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
                {showTable && (
  <Box position="absolute" zIndex="100">
    <Table1 data={data} />
  </Box>
)}
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

export default Home;