import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Invoice = () => {
  const { state } = useLocation();
  const booking = state?.booking;
  const space = booking?.space_id;

  const [hours, setHours] = useState(0);

  useEffect(() => {
    if (space?.slot_start_time && space?.slot_end_time) {
      const durationHours = calculateDurationHours(space.slot_start_time, space.slot_end_time);
      setHours(durationHours);
    }
  }, [space]);

  const calculateDurationHours = (start, end) => {
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

    return Math.floor(diff / 60);
  };

  return (
    <div className="container mt-4" style={{ color: 'black', fontFamily: 'Arial, sans-serif' }}>
      <div className="card shadow-sm p-4">
        <h2 className="text-center fw-bold mb-4">Parking Invoice</h2>

        <div className="mb-3">
          <p className="mb-1"><strong>Seeker Name:</strong> {booking?.user_id?.name || "N/A"}</p>
        </div>

        <hr />

        <div className="row mb-3">
          <div className="col-sm-12 col-md-6">
            <p><strong>Vehicle:</strong> {booking?.vehicle_company} {booking?.vehicle_model} ({booking?.car_color})</p>
          </div>
          <div className="col-sm-12 col-md-6">
            <p><strong>Plate Number:</strong> {booking?.plate_number}</p>
          </div>
        </div>

        <hr />

        <div className="row mb-3">
          <div className="col-sm-12 col-md-6">
            <p><strong>Date:</strong> {space?.date ? new Date(space.date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Time Slot:</strong> {space?.slot_start_time} - {space?.slot_end_time}</p>
            <p><strong>Duration:</strong> {hours} hr</p>
          </div>
          <div className="col-sm-12 col-md-6">
            <p><strong>Rate (per booking):</strong> ₹{space?.price}</p>
          </div>
        </div>

        <hr />

        <div className="row mb-3">
          <div className="col-sm-12 col-md-6">
            <p><strong>Space:</strong> {space?.name}</p>
          </div>
          <div className="col-sm-12 col-md-6">
            <p><strong>Parking Location:</strong> {space?.parking_id?.name}</p>
          </div>
        </div>

        <hr />

        <div className="d-flex justify-content-end mb-4">
          <p style={{ fontSize: '1.25rem' }}><strong>Total: ₹{space?.price}</strong></p>
        </div>

        <hr />

        <div className="text-center mt-3">
          <p className="fw-bold" style={{ fontSize: '1rem' }}>
            Please show this invoice to the parking owner at the entrance for verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
