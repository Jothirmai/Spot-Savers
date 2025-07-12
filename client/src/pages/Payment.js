import React from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) {
    return <div className="container mt-5"><h4>No booking data provided.</h4></div>;
  }

  const userName = booking?.user_id?.name || 'User';
  const parkingName = booking?.parking_id?.name || 'Parking';
  const date = booking?.date || 'N/A';
  const start = booking?.booking_start_time;
  const end = booking?.booking_end_time;
  const price = booking?.price || 0;

  const getDuration = () => {
    if (!start || !end) return '-';
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    const hr = Math.floor(mins / 60);
    const min = mins % 60;
    return `${hr > 0 ? `${hr} hr ` : ''}${min} min`;
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Parking Invoice</h2>

        <div className="mb-3">
          <strong>Seeker Name:</strong> {userName}
        </div>
        <div className="mb-3">
          <strong>Parking Location:</strong> {parkingName}
        </div>
        <div className="mb-3">
          <strong>Date:</strong> {date}
        </div>
        <div className="mb-3">
          <strong>Time Slot:</strong> {start} - {end}
        </div>
        <div className="mb-3">
          <strong>Duration:</strong> {getDuration()}
        </div>
        <div className="mb-3">
          <strong>Rate:</strong> ₹{price}
        </div>

        <hr />
        <h4 className="text-end">Total: ₹{price}</h4>

        <p className="text-muted mt-4 text-center">
          Thank you for using our parking service!
        </p>
      </div>
    </div>
  );
};

export default Payment;
