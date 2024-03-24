import React, { useContext, useEffect, useRef, useState } from 'react';
import LocationContext from '../components/LocationContext.js';
import { showCurrentLocation, findParkingSpaces } from "../api/mapdata.js";
import { Box, Button, ButtonGroup, Flex, HStack, IconButton, SkeletonText } from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import { useJsApiLoader, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import Table1 from '../components/dyn_tab'
import Navbar from './Navbar.js';


const Home = () => {
  const [data, setData] = useState(null); // state variable to store fetched data
  const [showTable, setShowTable] = useState(false); // state variable to control visibility of DataTable
  const {destination} = useContext(LocationContext);
  const [center, setCenter] = useState();
  const [response, setResponse] = useState(null);


  
  useEffect(() => {
    async function getCurrentLocation() {
      try {
        const location = await showCurrentLocation();
        console.log('here', location);
        setCenter(location);
        const fetchedData = await findParkingSpaces(location.lat,location.lng); // add await here
        console.log("haine?",fetchedData);
        setData(fetchedData);
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


  async function on_click_calc() {

    showCurrentLocation();
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
                {(showTable) && (
  <Box position="absolute" zIndex="100">
    <Table1 data={data} />
  </Box>

)}
 <Navbar />
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
        {destination && (

          <DirectionsService
  // required: start and end coordinates
  options={{
    destination: { lat: destination.latitude, lng: destination.longitude },
    origin: { lat: destination.user_latitude, lng: destination.user_longitude },
    travelMode: 'DRIVING'
  }}
  // required: callback function to capture the results
  callback={(result, status) => {
    if (status === 'OK'&& JSON.stringify(result) !== JSON.stringify(response)) {
      setResponse(result);
    }
  }}
/>
      )}

{response && (
  <DirectionsRenderer
    // required: response from DirectionsService
    options={{
      directions: response
    }}
  />
)}
      </GoogleMap>
    </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="10px"
        zIndex="1"
        className='parking-box'
      >
        <HStack spacing={2} justifyContent="space-between">
 


          <ButtonGroup className='parking-finder'>
            <Button colorScheme="pink" type="submit" onClick={on_click_calc}>
              Find Parking
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>

      </Box>

    </Flex>
  );
};

export default Home;