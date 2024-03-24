
import '../css/d_table.css';
import React, { useContext } from 'react';
import LocationContext from '../components/LocationContext';



function Table1({ data }) {

  const { setDestination } = useContext(LocationContext);
  function handleRowClick(item){
    setDestination(item);
  }
  return (
    <div className='table-container'>
      <table className='parking_spaces'>
        <thead>
          <tr>
            <th>Details</th>
            <th>Duration and Distance</th>
            <th className='fare_column'>Fare</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} onClick = {() => handleRowClick(item)}>
              <td>
                <button className='table-button'>
                  <div className='table-name'>{item.name}</div>
                  <div className='table-address'>{item.address}</div>
                </button>
              </td>
              <td>
                <div className='table-duration'>{item.duration}</div>
                <div className='table-distance'>{item.distance}</div>
              </td>
              <td className='fare-column'>
                <div className='table-fare'>Rs. {item.fare.predictedPrice}</div> {/* New cell for Fare */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table1;