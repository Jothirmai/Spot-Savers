import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const { state } = useLocation();
  const booking = state?.booking;
  const space = booking?.space_id;

  const [hours, setHours] = useState(0);

  useEffect(() => {
    if (space?.slot_start_time && space?.slot_end_time) {
      const h = calculateHours(space.slot_start_time, space.slot_end_time);
      setHours(h);
    }
  }, [space]);

  const calculateHours = (start, end) => {
    const parseTime = (t) => {
      const [time, meridian] = t.split(/(?=[ap]m)/);
      let [h, m] = time.split(':').map(Number);
      if (meridian === 'pm' && h !== 12) h += 12;
      if (meridian === 'am' && h === 12) h = 0;
      return h * 60 + (m || 0);
    };
    const diffMins = parseTime(end) - parseTime(start);
    return Math.floor(diffMins / 60);
  };

  return (
    <div className="container py-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div
        className="card p-4 shadow-lg rounded-4"
        style={{
          background: 'linear-gradient(135deg, #fdfdfd, #f0f4f8)',
          border: '1px solid #ccc',
          maxWidth: '800px',
          margin: 'auto'
        }}
      >
        <h2 className="text-center fw-bold mb-4">
          🧾 Parking Invoice
        </h2>

        <div className="row border-bottom pb-3">
          <div className="col-12 col-md-6">
            <p><strong>🚗 Vehicle:</strong> {booking?.vehicle_company} {booking?.vehicle_model} ({booking?.car_color})</p>
          </div>
          <div className="col-12 col-md-6">
            <p><strong>🔢 Plate Number:</strong> {booking?.plate_number}</p>
          </div>
        </div>

        <div className="row border-bottom py-3">
          <div className="col-12 col-md-6">
            <p><strong>📅 Date:</strong> {space?.date ? new Date(space.date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>🕒 Time Slot:</strong> {space?.slot_start_time} - {space?.slot_end_time}</p>
            <p><strong>⏳ Duration:</strong> {hours} hr</p>
          </div>
          <div className="col-12 col-md-6">
            <p><strong>💸 Rate (per booking):</strong> ₹{space?.price}</p>
          </div>
        </div>

        <div className="row border-bottom py-3">
          <div className="col-12 col-md-6">
            <p><strong>📍 Space:</strong> {space?.name}</p>
          </div>
          <div className="col-12 col-md-6">
            <p><strong>🏙️ Parking Location:</strong> {space?.parking_id?.name}</p>
          </div>
        </div>

        <div className="text-end pt-4">
          <h4 className="fw-bold text-dark">Total: ₹{space?.price}</h4>
        </div>

        <div className="text-center mt-4 border-top pt-3">
          <p className="fw-semibold text-dark">
            🚦 Please show this invoice to the parking owner at the entrance for verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
