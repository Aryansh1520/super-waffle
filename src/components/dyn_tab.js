import React from 'react';
import '/home/aryan/Desktop/super-waffle/src/css/d_table.css';

function Table1({ data }) {
  if (!Array.isArray(data)) {
    console.log('Data is not an array');
    return null; // or some fallback UI
  }
  return (
    <div className='table-container'>
      <table className='parking_spaces'>
        <thead>
          <tr>
            <th>Details</th>
            <th>Duration and Distance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table1;