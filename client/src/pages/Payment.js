import React from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const { state } = useLocation();
  const booking = state?.booking;

  const user = booking?.user_id;
  const space = booking?.space_id;
  const vehicle = {
    company: booking?.vehicle_company,
    model: booking?.vehicle_model,
    plate: booking?.plate_number,
    color: booking?.car_color,
  };

  if (!booking || !space || !user) {
    return <div className="container mt-5"><h4>Booking or space info missing.</h4></div>;
  }

  // Format date
  const dateStr = new Date(space.date).toLocaleDateString();

  // Duration calculation
  const [startH, startM] = space.slot_start_time.split(":").map(Number);
  const [endH, endM] = space.slot_end_time.split(":").map(Number);
  const totalMins = (endH * 60 + endM) - (startH * 60 + startM);
  const duration = `${Math.floor(totalMins / 60)} hr ${totalMins % 60} min`;

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Parking Invoice</h2>

        <div><strong>Seeker Name:</strong> {user.name}</div>
        <div><strong>Vehicle:</strong> {vehicle.company} {vehicle.model} ({vehicle.color})</div>
        <div><strong>Plate Number:</strong> {vehicle.plate}</div>
        <div><strong>Date:</strong> {dateStr}</div>
        <div><strong>Time Slot:</strong> {space.slot_start_time} - {space.slot_end_time}</div>
        <div><strong>Duration:</strong> {duration}</div>
        <div><strong>Rate:</strong> ₹{space.price}</div>

        <hr />
        <h4 className="text-end">Total Amount: ₹{space.price}</h4>

        <p className="text-muted mt-4 text-center">
          Thank you for booking with us. Drive safe!
        </p>
      </div>
    </div>
  );
};

export default Payment;
