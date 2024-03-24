import React from "react";
import { createRoot } from 'react-dom/client';
import LocationProvider from "./components/LocationProvider";

import App from "./App";
import { ChakraProvider, theme } from "@chakra-ui/react";

const root = createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <LocationProvider>
      <App />
    </LocationProvider>
  </ChakraProvider>
);