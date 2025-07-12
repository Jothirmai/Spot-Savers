import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const { state } = useLocation();
  const booking = state?.booking;
  const space = booking?.space_id;

  const [duration, setDuration] = useState({ hours: 0, mins: 0 });

  useEffect(() => {
    if (space?.slot_start_time && space?.slot_end_time) {
      setDuration(calculateDuration(space.slot_start_time, space.slot_end_time));
    }
  }, [space]);

  const calculateDuration = (start, end) => {
    const toMinutes = (timeStr) => {
      const [time, modifier] = timeStr.split(/(?=[ap]m)/);
      let [h, m] = time.split(':').map(Number);
      if (modifier === 'pm' && h !== 12) h += 12;
      if (modifier === 'am' && h === 12) h = 0;
      return h * 60 + (m || 0);
    };

    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    const diff = endMin - startMin;

    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return { hours, mins };
  };

  return (
    <div className="container mt-5" style={{ color: '#000' }}>
      <div className="border p-4 shadow-sm rounded">
        <h2 className="mb-4 text-center">Parking Invoice</h2>

        <p><strong>Seeker Name:</strong> {booking?.user_id?.name}</p>
        <p><strong>Email:</strong> {booking?.user_id?.email}</p>

        <hr />

        <p><strong>Vehicle:</strong> {booking?.vehicle_company} {booking?.vehicle_model} ({booking?.car_color})</p>
        <p><strong>Plate Number:</strong> {booking?.plate_number}</p>

        <hr />

        <p><strong>Date:</strong> {space?.date ? new Date(space.date).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Time Slot:</strong> {space?.slot_start_time} - {space?.slot_end_time}</p>
        <p><strong>Duration:</strong> {duration.hours} hr {duration.mins} min</p>

        <p><strong>Rate:</strong> ₹{space?.price}</p>
        <p><strong>Total:</strong> ₹{space?.price}</p>

        <hr />

        <p><strong>Space:</strong> {space?.name}</p>
        <p><strong>Parking Location:</strong> {space?.parking_id?.name}</p>
        <p><strong>Owner:</strong> {space?.parking_id?.user_id?.name}</p>

        <hr className="my-4" />

        <p className="fw-bold mt-3" style={{ fontSize: '1.1rem' }}>
          Please show this invoice to the parking owner at the entrance for verification.
        </p>
      </div>
    </div>
  );
};

export default Payment;
