import React, { useEffect } from 'react';
import { gsap } from 'gsap'; // Import GSAP for animations
import Navbar from './Navbar';
import I1 from '../asset/parking-img.webp'

import leftIllustration from '../asset/leftill.jpg'; // Import your left illustration PNG
import rightIllustration from '../asset/rightill.jpg'; // Import your right illustration PNG

 
const Landing = () => {

  
  useEffect(() => {
    // Animation for the heading
    gsap.from('.heading-cont', { opacity: 0, y: -50, duration: 1, delay: 0.5 });
    gsap.from('.heading-body-cont', { opacity: 0, y: -50, duration: 1, delay: 0.5 });
    gsap.from('.left-illustration', { opacity: 0, x: -50, duration: 1, delay: 1.0 });

    // Animation for the right illustration
    gsap.from('.right-illustration', { opacity: 0, x: 50, duration: 1, delay: 1.2 });
    // Animation for the button
    gsap.from('.cta-button', { opacity: 0, y: 50, duration: 1, delay: 1.5 });
  }, []);

  return (
<div>
    <Navbar />
    <div className="home-cont">
    
    <img className="left-illustration" src={leftIllustration} alt="Left Illustration" />
      <img className="right-illustration" src={rightIllustration} alt="Right Illustration" />
      <div className="animation-cont=">
        <h1 className="heading-cont">Welcome to Dynamic Parking</h1>
        <p className='heading-body-cont'>Find parking spots on the go and pay seamlessly!</p>
        <button className="cta-button">Get Started</button>
      </div>
    </div>
<div className='break-container'>
  <br/>
  <h1 className='break-text'>
    User friendly and Easy to use
  </h1>
</div>
    
   <div class="container-info">
   <div class="side">
     <img alt="content" width="100%" src={I1} />
   </div>
   <div class="side side-content-center">
     <div>
       <h1 className='Heading-content'>
         How It works?
       </h1>
       <p className='Body-content'> Simply log in to access a wealth of parking options tailored to your preferences. Explore available spots using location-based search or interactive maps. Review detailed fare information, dynamically adjusted for demand and availability, before making your selection. Once you've found the perfect spot, booking is a breeze. </p>
       <br/>
       <p className='Body-content'>
       Experience stress-free parking with our intuitive system, designed to enhance your journey every step of the way.
       </p>
       <button type='button' className='learn-btn' >TRY NOW</button>
     </div>
   
   </div>
  
 </div> 

 <div className='end-container'>
  <br/>
  <h1 className='end-text'>
    If you liked our Idea, do let us know on
  </h1>
  <a href = "#" className='final-link'>isakshy18@gmail.com</a>
  <h1 className='end-text'>
    ❤️
  </h1>
</div>
    </div>
  );
};

export default Landing;
