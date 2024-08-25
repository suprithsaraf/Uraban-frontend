import { Routes, Route, Link, useParams } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "./Context/AuthContext";
import "./bookings.css"

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Allservice from "./components/Allservice";
import ForgotPassword from "./components/ForgetPassword";
import ResetPassword from "./components/resetPassword";
import Private from "./components/private";
import Verification from "./components/Verification";
import Service from "./components/Service";
import Icons from "./components/Icons";
import Unauthorized from "./components/Unathorized";
import Cancel from "./components/payment/cancel";
import BookingProfile from "./components/BookingProfile";
import BookingPayment from "./components/payment/booking";
import Success from "./components/payment/successful";
import BookingList from "./components/BookingList";
import ConfirmedBooking from "./components/ConfirmedBooking";
import BookingDetail from "./components/bookingdetails";
import Profile from "./components/Profile";
import Allserviceprovider from "./components/adminDashboard/Allserviceprovider";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import './App.css'
import ublogoimg from "./assets/images/ublogo.jpeg"
import CustomerHistory from "./components/CustomerHistory";
import CustomerProfile from "./components/CustomerProfile";
import CustomerAccount from "./components/CustomerAccount";
import PaymentList from "./components/PaymentList";


function App() {
  const { dispatch, user } = useAuth();
  const { serviceId ,customerId} = useParams();

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="App">
      <header id="headerPart">
        <Navbar bg="transparent" expand="lg" id="navSection1">
          <Container id="navSection2" fluid>
            <Navbar.Brand as={Link} to="/" id="companyIcon">
              <img id="ublogo" src={ublogoimg} width='110' height='30'/>            
              <strong id="dummyDiv"> {/* Dont delete the strong tag  */} </strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav">
  <Nav className="me-auto" class="navbarSub">
  <Nav.Link as={Link} to="/" id="navbarHome">Home</Nav.Link>

    {user.account && user.account.role === "admin" && (
      <Nav.Link as={Link} to="/allserviceprovider">
        <i className="fas fa-tachometer-alt"></i> Admin Dashboard
      </Nav.Link>
    )}

 
    {user.isLoggedIn && (
      <Nav.Link as={Link} to="/allservice" id="navbarAllserices">All Services</Nav.Link>
    )}

    {!user.isLoggedIn ? (
      <>
        <Nav.Link as={Link} to="/register" id="navbarRegiter">Register</Nav.Link>
        <button id="nvabarLogin">
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        </button>
      </>
    ) : (
      <>
        {user.account && user.account.role === "serviceprovider" && (
          <Nav.Link as={Link} to="/service" id="navbarAllserices">Add Service</Nav.Link>
        )}
        {user.account && (user.account.role === "serviceprovider" || user.account.role === "admin") && (
          <Nav.Link as={Link} to={`/service/${serviceId}/bookings`} id="navbarAllserices">Booking List</Nav.Link>
        )}
        {user.account && user.account.role === "serviceprovider" && (
          <Nav.Link as={Link} to="/profile" id="navbarAllserices">Profile</Nav.Link>
        )}
        {user.account && user.account.role === "serviceprovider" && (
          <Nav.Link as={Link} to="/account" id="navbarAllserices">Account</Nav.Link>
        )}
           {user.account && user.account.role === "customer" && (
          <Nav.Link as={Link} to={`/customer-history/${customerId}/history`} id="navbarAllserices">CustomerHistory</Nav.Link>
        )}
            {user.account && user.account.role === "customer" && (
          <Nav.Link as={Link} to="/CustomerProfile"id="navbarAllserices">CustomerProfile</Nav.Link>
        )}

         {user.account && user.account.role === "customer" && (
          <Nav.Link as={Link} to="/CustomerAccount"id="navbarAllserices">CustomerAccount</Nav.Link>
        )} 

           {user.account && user.account.role === "admin" && (
          <Nav.Link as={Link} to="/PaymentList"id="navbarAllserices">PaymentList</Nav.Link>
        )}   


        <button id="nvabarLogin">
          <Nav.Link as={Link} to="/" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </Nav.Link>
        </button>                 
      </>
    )}
  </Nav>
</Navbar.Collapse>

          </Container>
        </Navbar>
      </header>

      <main id="routePage" >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/forgetPassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/icons" element={<Icons />} />
          <Route path="/Unathorized" element={<Unauthorized />} />
          <Route path="/bookingpayment/:bookingId/:price" element={<BookingPayment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/ConfirmedOrder" element={<ConfirmedBooking />} />
          <Route path="/booking-detail/:bookingId" element={<BookingDetail />} />
          <Route path="/booking/:serviceId" element={<BookingProfile />} />
          <Route path="/service/:serviceId/bookings" element={<BookingList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/allserviceprovider" element={<Allserviceprovider />} />
          <Route path="/customer-history/:customerId/history" element={<CustomerHistory/>} />
          <Route path="/CustomerProfile" element={<CustomerProfile/>}/>
          <Route path="/CustomerAccount" element={<CustomerAccount/>}/>
          <Route path="/PaymentList"  element={<PaymentList/>}/>

          <Route path='/service' element={
            <Private permittedRoles={['serviceprovider']}>
              <Service />
            </Private>} />
          <Route path='/allserviceprovider' element={
            <Private permittedRoles={['admin']}>
              <Allserviceprovider />
            </Private>} />
          <Route path='/allservice' element={
            <Private permittedRoles={['customer', 'serviceprovider', 'admin']}>
              <Allservice />
            </Private>} />
          <Route path='/account' element={
            <Private permittedRoles={['customer', 'serviceprovider']}>
              <Account />
            </Private>} />
          <Route path="/service/:serviceId/bookings" element={
            <Private permittedRoles={['serviceprovider', 'admin']}>
              <BookingList />
            </Private>} />
          <Route path='/booking-detail/:bookingId' element={
            <Private permittedRoles={['serviceprovider', 'admin']}>
              <BookingDetail />
            </Private>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
