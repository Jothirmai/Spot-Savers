import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Payment = () => {
  const { state } = useLocation();
  const booking = state?.booking;
  const userId = booking?.user_id?._id || booking?.user_id;

  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [instruction, setInstruction] = useState('');
  const [amount, setAmount] = useState();

  useEffect(() => {
    if (!booking) {
      toast.error("No booking selected");
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
    try {
      if (!selectedMethod) return toast.error("Please select a payment method");
      const res = await axios.post('/api/payment-methods/simulate', {
        method_id: selectedMethod,
        booking_id: booking._id,
      });
      setInstruction(res.data.instruction);
      setAmount(res.data.amount);
    } catch (err) {
      console.error(err);
      toast.error("Payment simulation failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Payment for Booking</h2>

      <div className="form-group mt-4">
        <label>Select Payment Method:</label>
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

      <button className="btn btn-primary mt-3" onClick={handleSimulate}>
        Simulate Payment
      </button>

      {amount && (
        <div className="alert alert-info mt-4">
          <strong>Amount:</strong> {amount}
          <br />
          <strong>Instructions:</strong> {instruction}
        </div>
      )}
    </div>
  );
};

export default Payment;
