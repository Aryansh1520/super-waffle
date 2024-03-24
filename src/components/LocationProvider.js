// LocationProvider.js
import React, { useState } from 'react';
import LocationContext from './LocationContext';

const LocationProvider = ({ children }) => {
  const [destination, setDestination] = useState(null);

  return (
    <LocationContext.Provider value={{ destination, setDestination }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;