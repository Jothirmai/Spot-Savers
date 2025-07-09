import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteBooking, fetchBookings, updateBooking } from '../api/api';
import { DeleteModal } from '../components';

const ITEMS_PER_PAGE = 10;

const Booking = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBookings = bookings.slice(startIndex, endIndex);
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  const fetchData = () => {
    setLoading(true);
    const fetchParams = user?.type === 'owner' ? { owner_id: user?._id } : { user_id: user?._id };
    fetchBookings({
      ...fetchParams,
      setBookings: (data) => {
        setBookings(data);
        setTimeout(() => setLoading(false), 1000);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const handleUpdateBooking = ({ id, confirm_booking }) => {
    let body = { confirm_booking };
    updateBooking({
      id,
      body,
      handleUpdateBookingSuccess: fetchData,
      handleUpdateBookingFailure: (err) => console.log('handleUpdateBookingFailure', err)
    });
  };

  const handleDeleteBooking = () => {
    deleteBooking({
      id: selectedBooking?._id,
      handleDeleteBookingSuccess: () => {
        fetchData();
        setShowDeleteModal(false);
      },
      handleDeleteBookingFailure: () => {
        setShowDeleteModal(false);
      }
    });
  };

  const proceedToPayment = (booking) => {
    navigate('/payment', { state: { booking } });
  };

  const renderBookingsRow = () => {
    return paginatedBookings.map((item, index) => (
      <tr key={index}>
        <th scope="row">{startIndex + index + 1}</th>
        <td>{item?.vehicle_company}</td>
        <td>{item?.vehicle_model}</td>
        <td>{item?.plate_number}</td>
        <td>{item?.car_color}</td>
        <td>{item?.space_id?.name}</td>
        <td>{moment.utc(item?.space_id?.date).format('DD-MM-YYYY')}</td>
        <td>{item?.space_id?.slot_start_time}</td>
        <td>{item?.space_id?.slot_end_time}</td>
        <td>{moment.utc(item?.createdAt).format('DD-MM-YYYY / hh:mm a')}</td>
        <td>{item?.confirm_booking}</td>
        <td>
          {user?.type === 'seeker' ? (
            item?.confirm_booking === 'approved' ? (
              <button
                className="btn btn-outline-primary"
                onClick={() => proceedToPayment(item)}
              >
                Proceed with Payment
              </button>
            ) : item?.confirm_booking === 'pending' ? (
              <button className='btn btn-outline-danger ms-2' onClick={() => handleDelete(item)}>
                <i className="bi bi-trash3-fill"></i>
              </button>
            ) : (
              <span>Done</span>
            )
          ) : (
            item?.confirm_booking === 'pending' ? (
              <>
                <button
                  className='btn btn-outline-success ms-2'
                  onClick={() => handleUpdateBooking({ id: item?._id, confirm_booking: 'approved' })}
                >
                  <i className="bi bi-check2"></i>
                </button>
                <button
                  className='btn btn-outline-danger ms-2'
                  onClick={() => handleUpdateBooking({ id: item?._id, confirm_booking: 'rejected' })}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </>
            ) : (
              <span>Sent</span>
            )
          )}
        </td>
      </tr>
    ));
  };

  const renderPagination = () => {
    return (
      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <div className='container'>
      <h1 className='mt-5'>My Bookings</h1>

      <div className='row mt-2 g-5 table-responsive'>
        {loading ? (
          <div style={styles.spinnerWrapper}>
            <div style={styles.spinnerContainer}>
              <svg
                className="animate-spinner"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="50"
                height="50"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          </div>
        ) : (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Vehicle company</th>
                <th scope="col">Vehicle model</th>
                <th scope="col">Plate number</th>
                <th scope="col">Car color</th>
                <th scope="col">Space</th>
                <th scope="col">Space Date</th>
                <th scope="col">Slot start time</th>
                <th scope="col">Slot end time</th>
                <th scope="col">Booking time</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                renderBookingsRow()
              ) : (
                <tr>
                  <td colSpan={12} className="text-center"><em>No bookings found</em></td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && bookings.length > ITEMS_PER_PAGE && renderPagination()}

      <DeleteModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} onDeleteConfirm={handleDeleteBooking} />
    </div>
  );
};

const styles = {
  spinnerWrapper: {
    height: '50vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    fontSize: '1.2rem',
    color: '#007bff',
  },
};

export default Booking;