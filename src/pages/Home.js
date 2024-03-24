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
  const [data, setData] = useState(null); // state variable to store fetched data
  const [showTable, setShowTable] = useState(false); // state variable to control visibility of DataTable



  const [center, setCenter] = useState();

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
        minW="10px"
        zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
 


          <ButtonGroup>
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