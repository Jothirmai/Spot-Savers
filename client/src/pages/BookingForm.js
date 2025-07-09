import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createBooking, fetchSpaces } from '../api/api';
import { toast } from 'react-toastify';
import '../css/createParking.scss';

const BookingForm = () => {
  const { state } = useLocation();
  const user = useSelector((state) => state.user);
  const [space, setSpace] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vehicle_company: '',
    vehicle_model: '',
    plate_number: '',
    car_color: '',
    space_id: '',
  });

  const handleFormChange = ({ key, value }) => {
    setForm({ ...form, [key]: value });
  };

  const handleCreateBooking = () => {
    setLoading(true);
    const body = { ...form, user_id: user?._id };

    createBooking({
      body,
      handleCreateBookingSuccess: () => {
        toast.success('Booking successful!');
        setLoading(false);
        setForm({
          vehicle_company: '',
          vehicle_model: '',
          plate_number: '',
          car_color: '',
          space_id: form.space_id, // Keep selected space
        });
      },
      handleCreateBookingFailure: (error) => {
        toast.error(error || 'Booking failed');
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchSpaces({ setSpaces });
    setSpace(state?.space);
    handleFormChange({ key: 'space_id', value: state?.space?._id });
  }, [state]);

  return (
    <div className='container py-5'>
      <div className='card create-parking-card p-5'>
        <h3 className='mb-4'>Make booking</h3>

        <div className='mb-3'>
          <label htmlFor='vehicle_company' className='form-label'>
            Vehicle company
          </label>
          <input
            type='text'
            className='form-control'
            id='vehicle_company'
            value={form?.vehicle_company}
            onChange={(e) =>
              handleFormChange({ key: 'vehicle_company', value: e.target.value })
            }
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='vehicle_model' className='form-label'>
            Vehicle model
          </label>
          <input
            type='text'
            className='form-control'
            id='vehicle_model'
            value={form?.vehicle_model}
            onChange={(e) =>
              handleFormChange({ key: 'vehicle_model', value: e.target.value })
            }
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='plate_number' className='form-label'>
            Plate number
          </label>
          <input
            type='text'
            className='form-control'
            id='plate_number'
            value={form?.plate_number}
            onChange={(e) =>
              handleFormChange({ key: 'plate_number', value: e.target.value })
            }
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='car_color' className='form-label'>
            Car color
          </label>
          <input
            type='text'
            className='form-control'
            id='car_color'
            value={form?.car_color}
            onChange={(e) =>
              handleFormChange({ key: 'car_color', value: e.target.value })
            }
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='space' className='form-label'>
            Space
          </label>
          <select
            className='form-select'
            value={form?.space_id}
            onChange={(e) =>
              handleFormChange({ key: 'space_id', value: e.target.value })
            }
            disabled
          >
            <option value=''>Select</option>
            {spaces?.map((item) => (
              <option key={item?._id} value={item?._id}>
                {item?.name}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-3'>
          <label htmlFor='space' className='form-label'>
            Space details
          </label>
          <p>
            <strong>Date: </strong>
            {moment.utc(space?.date).format('DD-MM-YYYY')}
          </p>
          <p>
            <strong>Start time: </strong>
            {space?.slot_start_time}
          </p>
          <p>
            <strong>End time: </strong>
            {space?.slot_end_time}
          </p>
          <p>
            <strong>Price: </strong>
            {space?.price}
          </p>
          <p>
            <strong>Address: </strong>
            {space?.parking_id?.address}
          </p>
          <p>
            <strong>City: </strong>
            {space?.parking_id?.city}
          </p>
        </div>

        <button
          type='submit'
          className='btn btn-primary mt-4 d-flex align-items-center justify-content-center gap-2'
          onClick={handleCreateBooking}
          disabled={loading}
        >
          {loading ? (
            <svg
              className='animate-spinner'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              width='24'
              height='24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
              />
            </svg>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
