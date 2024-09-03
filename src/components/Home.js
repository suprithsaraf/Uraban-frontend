import { useAuth } from "../Context/AuthContext";
import '../Home.css';
import { useNavigate} from "react-router-dom";

import SimpleImageSlider from "react-simple-image-slider";
import paintingImg from "../assets/images/painting1.jpg"
import bathcleaningImg from "../assets/images/bathcleaning.jpeg"
import acImg from "../assets/images/ac.jpg"
import plumberImg from "../assets/images/eletricAndplumber.jpeg"
import saloonImg from "../assets/images/salonservice.jpg"
import acLogo from "../assets/images/AClogo.png"
import saloonLogo from "../assets/images/SaloonImage.png"
import { TypeAnimation } from 'react-type-animation';

   

export default function Home() {
  const navigate=useNavigate()
  const { user } = useAuth();
  const images = [
    { url: `${paintingImg}` },
    { url: `${acImg}` },
    { url: `${bathcleaningImg}` },
    { url: `${plumberImg}` },
    { url: `${saloonImg}` },
  ];
  const ExampleComponent = () => {
    return (
      <TypeAnimation
        sequence={[
          // Same substring at the start will only be typed out once, initially
          'Urban Company...',
          1000, // wait 1s before replacing "Mice" with "Hamsters"
          'Urban Company...',
          1000,
          'Urban Company...',
          1000,
          'Urban Company...',
          1000
        ]}
        wrapper="span"
        speed={1}
        style={{ fontSize: '2em', display: 'inline-block' }}
        repeat={Infinity}
      />
    );
  };
  const handleNav=()=>{
   navigate('/register')
  }
  const handleAdd=()=>{
    navigate('/service')
   }
   const handleButton=()=>{
    navigate('/Unathorized')
   }
 
  return (
    
    <main id="homeContainer">
      <section id="subConatiner1">
        <div id="sectionFirst">
          <div id="companyName">
          {ExampleComponent()}
          </div>
          <div id="companyDetails">
           <p>
            our company delivers exceptional home services with precision and care, ensuring your needs are met with professionalism and reliability. Trust us for quality solutions that enhance your comfort and convenience at home.
           </p>
           <p>
            Some of our services like Painting Of Walls & Furniture, AC Repair & Service, Electrician, Plumber & Carpenter, Bathroom & Kitchen Cleaning, Saloon etc...
           </p>
          </div>
         { user.account && user.account.role==="serviceprovider"? (
        <div id="serviceButton">
        <button   id="serviceBt"onClick={handleAdd}>Add service...</button>
        </div>
        ):(
        <div id="serviceButton">
         <button id="serviceBt" onClick={handleNav}>Register For Service...</button>
        </div>
        )}
       </div>
        <div id="serviceSlider">
      <SimpleImageSlider id="slider"
        height={300}
        width={500}
        images={images}
        showBullets={true}
        showNavs={true}
        autoPlay={true}
      />
        </div>
      </section>
      <section id="subConatiner2">
        <div id="d1">
          Services
        </div>
        <div id="d2">
        <div className="seviceIcon">
          <div className="iconDiv">
            <div className="subIcon">
            <i class="fa-solid fa-paint-roller"></i>
            </div>
          </div>
          <div className="headDiv" >
            Painting Of Walls & Furniture
          </div>
          <div className="conDiv">
            At Urban Company, we offer expert painting services for walls and furniture, delivering vibrant, long-lasting finishes that transform your space. Enhance your home's beauty with our professional touch and quality craftsmanship.
          </div>
        </div>
        <div className="seviceIcon">
          <div className="iconDiv">
            <div className="subIcon">
             <img src={acLogo} height="45" width="45"/>
            </div>
          </div>
          <div className="headDiv">
            AC Repair & Service
          </div>
          <div className="conDiv">
            At Urban Company, we offer expert AC repair and maintenance services. Our skilled technicians ensure your cooling system runs smoothly and efficiently, providing comfort and peace of mind all year round
          </div>
        </div>
        <div className="seviceIcon">
         <div className="iconDiv">
            <div className="subIcon">
             <i class="fa-solid fa-bolt"></i>
            </div>
          </div>
          <div className="headDiv">
            Electrician, Plumber & Carpenter
          </div>
          <div className="conDiv">
           Urban Company offers top-notch services in Electrician, Plumber, and Carpenter needs. Our skilled professionals ensure reliable solutions and quality craftsmanship for your home and office. Experience excellence with Urban Company
          </div>
        </div>
        <div className="seviceIcon">
          <div className="iconDiv">
            <div className="subIcon">
              <i class="fa-solid fa-kitchen-set"></i>
            </div>
          </div>
          <div className="headDiv">
            Bathroom & Kitchen Cleaning
          </div>
          <div className="conDiv">
            Urban Company offers top-notch Bathroom & Kitchen Cleaning services, ensuring a sparkling clean space with our professional team. Enjoy a hygienic, fresh environment with our thorough and reliable cleaning solutions.
          </div>
        </div>
        <div className="seviceIcon">
        <div className="iconDiv">
        <div className="subIcon">
             <img src={saloonLogo} height="45" width="45"/>
            </div>
          </div>
          <div className="headDiv">
            Saloon
          </div>
          <div className="conDiv">
          **Urban Company** offers top-notch salon services, including haircuts, styling, and treatments. Experience professional care and beauty transformations with our expert team, all designed to make you look and feel your best.
          </div>
        </div>
        </div>
      </section>
      <footer id="footerDiv">
        <p id="footerCon">
          Copyright © 2024 Urban Company. All rights reserved
        </p>
      </footer>
    </main>
  )
}
