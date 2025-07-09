import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createReview, deleteReview, fetchReviews } from '../api/api';
import { DeleteModal, StarRating } from '../components';
import { toast } from 'react-toastify';

const Reviews = () => {
  const user = useSelector((state) => state.user);
  const { state } = useLocation(); // expects parking_id in state

  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState({
    message: '',
    rating: 0,
  });

  useEffect(() => {
    if (state?.parking_id) {
      fetchReviews({
        parking_id: state.parking_id,
        setReviews,
      });
    }
  }, [state]);

  const handleFormChange = ({ key, value }) => {
    setForm({ ...form, [key]: value });
  };

  const handleCreateReview = () => {
    const body = {
      ...form,
      parking_id: state?.parking_id,
      user_id: user?._id,
    };

    createReview({
      body,
      handleCreateReviewSuccess,
      handleCreateReviewFailure,
    });
  };

  const handleCreateReviewSuccess = () => {
    fetchReviews({
      parking_id: state.parking_id,
      setReviews,
    });
    toast.success('Review added successfully!');
    setForm({ message: '', rating: 0 });
  };

  const handleCreateReviewFailure = (error) => {
    toast.error(error || 'Failed to add review');
  };

  const handleDelete = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleDeleteReview = () => {
    deleteReview({
      id: selectedReview?._id,
      handleDeleteReviewSuccess,
      handleDeleteReviewFailure,
    });
  };

  const handleDeleteReviewSuccess = () => {
    fetchReviews({
      parking_id: state.parking_id,
      setReviews,
    });
    setShowDeleteModal(false);
    toast.success('Review deleted');
  };

  const handleDeleteReviewFailure = () => {
    setShowDeleteModal(false);
    toast.error('Failed to delete review');
  };

  const reviewsRow = () =>
    reviews.map((item, index) => (
      <div key={index}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{item?.user_id?.name}</h5>
            <p className="mb-2">{item?.message}</p>
            <StarRating value={item?.rating} readonly />
          </div>
          {user?._id === item?.user_id?._id && (
            <button className="btn btn-outline-danger ms-2" onClick={() => handleDelete(item)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash3-fill"
                viewBox="0 0 16 16"
              >
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 
                            3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Z" />
              </svg>
            </button>
          )}
        </div>
        <hr />
      </div>
    ));

  return (
    <div className="container">
      <h2 className="mt-5">Reviews for this Parking Spot</h2>

      <div className="row mt-3">
        {reviews.length > 0 ? reviewsRow() : <em>No reviews yet for this location.</em>}

        {user?.type === 'seeker' && (
          <div className="mt-4">
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <input
                type="text"
                className="form-control"
                id="message"
                value={form.message}
                onChange={(e) => handleFormChange({ key: 'message', value: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rating</label>
              <br />
              <StarRating
                value={form.rating}
                onChange={(val) => handleFormChange({ key: 'rating', value: val })}
              />
            </div>

            <button className="btn btn-primary mt-3" onClick={handleCreateReview}>
              Submit
            </button>
          </div>
        )}
      </div>

      <DeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDeleteConfirm={handleDeleteReview}
      />
    </div>
  );
};

export default Reviews;
