import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Home, Layout, NoPage, Parking } from './pages';
import ParkingForm from './pages/ParkingForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Space from './pages/Space';
import SpaceForm from './pages/SpaceForm';
import BookingForm from './pages/BookingForm';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import Users from './pages/Users';
import About from './pages/About';
import Payment from './pages/Payment';

function App() {
  React.useEffect(() => {
    toast.info("🚀 Toast is working!");
  }, []);

  return (
    <BrowserRouter>
      {/* Toast Container must be inside Router but outside Routes */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
        style={{ zIndex: 9999 }}
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="parking" element={<Parking />} />
          <Route path="payment" element={<Payment />} />
          <Route path="parkingForm" element={<ParkingForm />} />
          <Route path="space" element={<Space />} />
          <Route path="spaceForm" element={<SpaceForm />} />
          <Route path="bookingForm" element={<BookingForm />} />
          <Route path="booking" element={<Booking />} />
          <Route path="profile" element={<Profile />} />
          <Route path="review" element={<Reviews />} />
          <Route path="users" element={<Users />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
