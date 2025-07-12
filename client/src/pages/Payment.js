import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { simulatePayment } from '../api/api';
import axios from 'axios';

const Payment = () => {
  const { state } = useLocation();
  const booking = state?.booking;

  const user = booking?.user_id?.name || 'User';
  const userId = booking?.user_id?._id || booking?.user_id;

  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [instruction, setInstruction] = useState('');
  const [amount, setAmount] = useState(booking?.price || 0);

  useEffect(() => {
    if (!booking || !booking._id) {
      toast.error("No valid booking provided");
      return;
    }
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get('/api/payment-methods');
      const userMethods = res.data.filter((m) => m.user_id === userId);
      setMethods(userMethods);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment methods");
    }
  };

  const handleSimulate = async () => {
    if (!selectedMethod) return toast.error("Please select a payment method");

    simulatePayment({
      method_id: selectedMethod,
      booking_id: booking._id,
      handleSuccess: (data) => {
        setAmount(data.amount);
        setInstruction(data.instruction);
        toast.success("Payment details loaded!");
      },
      handleFailure: (error) => {
        toast.error(error || "Failed to simulate payment");
      }
    });
  };

  const getMethodText = (id) => {
    const m = methods.find(m => m._id === id);
    if (!m) return '';
    return m.cash ? 'Cash' : `UPI - ${m.upi_id}`;
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      <div className="card shadow p-4">
        <h3 className="mb-4">Parking Invoice</h3>

        <div className="mb-3"><strong>Seeker:</strong> {user}</div>
        <div className="mb-3"><strong>Parking Location:</strong> {booking?.parking_id?.name || 'N/A'}</div>
        <div className="mb-3"><strong>Date:</strong> {booking?.date}</div>
        <div className="mb-3"><strong>Time:</strong> {booking?.slot_start_time} to {booking?.slot_end_time}</div>
        <div className="mb-3"><strong>Base Price:</strong> ₹{booking?.price}</div>

        <div className="mb-3">
          <label><strong>Select Payment Method:</strong></label>
          <select
            className="form-select"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
          >
            <option value="">-- Select --</option>
            {methods.map((m) => (
              <option key={m._id} value={m._id}>
                {m.cash ? 'Cash' : `UPI - ${m.upi_id}`}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary mt-2" onClick={handleSimulate}>
          Simulate Payment
        </button>

        <hr />

        {selectedMethod && (
          <div className="mt-3">
            <div><strong>Selected Method:</strong> {getMethodText(selectedMethod)}</div>
            <div><strong>Final Amount:</strong> ₹{amount}</div>
            {instruction && (
              <div className="mt-2 alert alert-info"><strong>Instructions:</strong> {instruction}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
