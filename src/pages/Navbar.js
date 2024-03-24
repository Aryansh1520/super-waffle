import React from 'react'

function Navbar() {
  return (
    <div className='navbar'>
        <ul>
            <li>
                <a href= "/login">
                    Login
                </a>
            </li>

           

            <li>
                <a href= "/maps">
                   Map
                </a>
            </li>

            <li>
                <a href= "/">
                   Home
                </a>
            </li>
        </ul>
    </div>
  )
}

export default Navbar