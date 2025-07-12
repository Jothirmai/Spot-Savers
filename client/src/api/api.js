import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// -------------------- PARKING ---------------------
export const fetchParkings = async ({ user_id, setParkings }) => {
  try {
    const query = user_id ? `?user_id=${user_id}` : '';
    const result = await axios.get(`${BASE_URL}parking${query}`);
    if (result?.data?.length) setParkings(result.data);
  } catch (error) {
    console.error('fetchParkings ', error);
  }
};

export const createParking = async ({ body, handleCreateParkingSuccess, handleCreateParkingFailure }) => {
  try {
    const result = await axios.post(`${BASE_URL}parking`, body);
    if (result?.data?.parking) return handleCreateParkingSuccess(result.data);
  } catch (error) {
    handleCreateParkingFailure(error?.response?.data?.error);
  }
};

export const updateParking = async ({ id, body, handleUpdateParkingSuccess, handleUpdateParkingFailure }) => {
  try {
    const result = await axios.put(`${BASE_URL}parking/${id}`, body);
    if (result?.data?.message) return handleUpdateParkingSuccess(result.data);
  } catch (error) {
    handleUpdateParkingFailure(error?.response?.data?.error);
  }
};

export const deleteParking = async ({ id, handleDeleteParkingSuccess, handleDeleteParkingFailure }) => {
  try {
    const result = await axios.delete(`${BASE_URL}parking/${id}`);
    if (result?.data?.message) return handleDeleteParkingSuccess(result.message);
  } catch (error) {
    handleDeleteParkingFailure(error?.response?.data?.error);
  }
};

// -------------------- SPACE ---------------------
export const fetchSpaces = async ({ user_id, parking_id, city, date, time, availability, setSpaces }) => {
  try {
    let query = '';
    if (user_id) query += `user_id=${user_id}&`;
    if (parking_id) query += `parking_id=${parking_id}&`;
    if (city) query += `city=${city}&`;
    if (date) query += `date=${date}&`;
    if (time) query += `time=${time}&`;
    if (availability) query += `availability=${availability}`;
    const result = await axios.get(`${BASE_URL}space?${query}`);
    if (result?.data?.length) setSpaces(result.data);
  } catch (error) {
    console.error('fetchSpaces ', error);
  }
};

export const fetchBookedSlots = ({ space_id, onSuccess, onError }) => {
    fetch(`/api/booking/booked?space_id=${space_id}`)
        .then(res => res.json())
        .then(onSuccess)
        .catch(onError);
};


export const createSpace = async ({ body, handleCreateSpaceSuccess, handleCreateSpaceFailure }) => {
  try {
    const filteredTimeSlots = Array.isArray(body.time_slots)
      ? body.time_slots.filter(slot =>
          slot &&
          typeof slot === 'object' &&
          slot.start_time &&
          slot.end_time &&
          slot.user_id
        )
      : [];

    const cleanedBody = {
      ...body,
      time_slots: filteredTimeSlots,
    };

    console.log('Sending space data:', cleanedBody);

    const result = await axios.post(`${BASE_URL}space`, cleanedBody);

    if (handleCreateSpaceSuccess && handleCreateSpaceFailure) {
      if (result?.data?.space) return handleCreateSpaceSuccess(result.data);
      else return handleCreateSpaceFailure('Unexpected response format');
    }

    if (result?.data?.space) return result.data;
    else throw new Error('Unexpected response format');
  } catch (error) {
    console.error('createSpace error:', error?.response?.data || error.message);
    if (handleCreateSpaceFailure) {
      handleCreateSpaceFailure(error?.response?.data?.error || 'Server error');
    } else {
      throw error;
    }
  }
};

export const updateSpace = async ({ id, body, handleUpdateSpaceSuccess, handleUpdateSpaceFailure }) => {
  try {
    const result = await axios.put(`${BASE_URL}space/${id}`, body);

    if (handleUpdateSpaceSuccess && handleUpdateSpaceFailure) {
      if (result?.data?.message) return handleUpdateSpaceSuccess(result.data);
      else return handleUpdateSpaceFailure('Unexpected response format');
    }

    if (result?.data?.message) return result.data;
    else throw new Error('Unexpected response format');

  } catch (error) {
    console.error('updateSpace error:', error?.response?.data || error.message);
    if (handleUpdateSpaceFailure) {
      handleUpdateSpaceFailure(error?.response?.data?.error || 'Server error');
    } else {
      throw error;
    }
  }
};

export const deleteSpace = async ({ id, handleDeleteSpaceSuccess, handleDeleteSpaceFailure }) => {
  try {
    const result = await axios.delete(`${BASE_URL}space/${id}`);
    if (result?.data?.message) return handleDeleteSpaceSuccess(result.message);
  } catch (error) {
    handleDeleteSpaceFailure(error?.response?.data?.error);
  }
};

// -------------------- USER ---------------------
export const login = async ({ email, password, handleLoginSuccess, handleLoginFailure }) => {
  try {
    const result = await axios.post(`${BASE_URL}user/login`, { email, password });
    if (result?.data?.token) return handleLoginSuccess(result.data);
  } catch (error) {
    handleLoginFailure(error?.response?.data?.error);
  }
};

export const register = async ({ name, email, password, type, handleRegisterSuccess, handleRegisterFailure }) => {
  try {
    const result = await axios.post(`${BASE_URL}user/register`, { name, email, password, type });
    if (result?.data?.name) return handleRegisterSuccess();
    handleRegisterFailure('Registration failed');
  } catch (error) {
    handleRegisterFailure(error?.response?.data?.error);
  }
};

export const resetPassword = async ({ user_id, body, handleResetPasswordSuccess, handleResetPasswordFailure }) => {
  try {
    const result = await axios.post(`${BASE_URL}user/resetPassword/${user_id}`, body);
    if (result?.data?.user) return handleResetPasswordSuccess(result.data);
  } catch (error) {
    handleResetPasswordFailure(error?.response?.data?.error);
  }
};

export const updateUser = async ({ user_id, body, handleUpdateUserSuccess, handleUpdateUserFailure }) => {
  try {
    const result = await axios.put(`${BASE_URL}user/${user_id}`, body);
    if (result?.data?.user) return handleUpdateUserSuccess(result.data);
  } catch (error) {
    handleUpdateUserFailure(error?.response?.data?.error);
  }
};

export const fetchUsers = async ({ setUsers }) => {
  try {
    const result = await axios.get(`${BASE_URL}user`);
    if (result?.data?.length) setUsers(result.data);
  } catch (error) {
    console.error('fetchUsers ', error);
  }
};

export const deleteUser = async ({ id, handleDeleteUserSuccess, handleDeleteUserFailure }) => {
  try {
    const result = await axios.delete(`${BASE_URL}user/delete/${id}`);
    if (result?.data?.message) return handleDeleteUserSuccess(result.message);
  } catch (error) {
    handleDeleteUserFailure(error?.response?.data?.error);
  }
};

// -------------------- BOOKING ---------------------
export const fetchBookings = async ({ owner_id, user_id, setBookings }) => {
  try {
    let query = '';
    if (user_id) query += `user_id=${user_id}&`;
    if (owner_id) query += `owner_id=${owner_id}&`;
    const result = await axios.get(`${BASE_URL}booking?${query}`);
    if (result?.data?.length) setBookings(result.data);
  } catch (error) {
    console.error('fetchBookings ', error);
  }
};

export const createBooking = async ({ body, handleCreateBookingSuccess, handleCreateBookingFailure }) => {
  try {
    const result = await axios.post(`${BASE_URL}booking`, body);
    if (result?.data?.booking) return handleCreateBookingSuccess(result.data);
  } catch (error) {
    handleCreateBookingFailure(error?.response?.data?.error);
  }
};

export const updateBooking = async ({ id, body, handleUpdateBookingSuccess, handleUpdateBookingFailure }) => {
  try {
    const result = await axios.put(`${BASE_URL}booking/${id}`, body);
    if (result?.data?.message) return handleUpdateBookingSuccess(result.data.message);
  } catch (error) {
    handleUpdateBookingFailure(error?.response?.data?.error);
  }
};

export const deleteBooking = async ({ id, handleDeleteBookingSuccess, handleDeleteBookingFailure }) => {
  try {
    const result = await axios.delete(`${BASE_URL}booking/${id}`);
    if (result?.data?.message) return handleDeleteBookingSuccess(result.message);
  } catch (error) {
    handleDeleteBookingFailure(error?.response?.data?.error);
  }
};

// -------------------- REVIEW ---------------------
export const fetchReviews = async ({ parking_id, setReviews }) => {
  try {
    const query = parking_id ? `?parking_id=${parking_id}` : '';
    const result = await axios.get(`${BASE_URL}review${query}`);
    if (result?.data?.length) setReviews(result.data);
  } catch (error) {
    console.error('fetchReviews ', error);
  }
};

export const createReview = async ({ body, handleCreateReviewSuccess, handleCreateReviewFailure }) => {
  try {
    const result = await axios.post(`${BASE_URL}review`, body);
    if (result?.data) return handleCreateReviewSuccess(result.data);
  } catch (error) {
    handleCreateReviewFailure(error?.response?.data?.error);
  }
};

export const deleteReview = async ({ id, handleDeleteReviewSuccess, handleDeleteReviewFailure }) => {
  try {
    const result = await axios.delete(`${BASE_URL}review/${id}`);
    if (result?.data?.message) return handleDeleteReviewSuccess(result.message);
  } catch (error) {
    handleDeleteReviewFailure(error?.response?.data?.error);
  }
};

// -------------------- PAYMENT ---------------------

export const createPaymentMethod = async ({ body, handleSuccess, handleFailure }) => {
  try {
    const result = await axios.post(`${BASE_URL}payment`, body);
    if (result?.data?.paymentMethod) return handleSuccess(result.data);
  } catch (error) {
    handleFailure(error?.response?.data?.error || "Failed to create payment method.");
  }
};

export const getPaymentMethods = async ({ setPaymentMethods }) => {
  try {
    const result = await axios.get(`${BASE_URL}payment`);
    if (Array.isArray(result.data)) setPaymentMethods(result.data);
  } catch (error) {
    console.error("getPaymentMethods error:", error);
  }
};

export const updatePaymentMethod = async ({ id, body, handleSuccess, handleFailure }) => {
  try {
    const result = await axios.put(`${BASE_URL}payment/${id}`, body);
    if (result?.data?.paymentMethod) return handleSuccess(result.data);
  } catch (error) {
    handleFailure(error?.response?.data?.error || "Failed to update payment method.");
  }
};

export const deletePaymentMethod = async ({ id, handleSuccess, handleFailure }) => {
  try {
    const result = await axios.delete(`${BASE_URL}payment/${id}`);
    if (result?.data?.message) return handleSuccess(result.data.message);
  } catch (error) {
    handleFailure(error?.response?.data?.error || "Failed to delete payment method.");
  }
};

export const simulatePayment = async ({ method_id, booking_id, handleSuccess, handleFailure }) => {
  try {
    const result = await axios.post(`${BASE_URL}payment/simulate`, {
      method_id,
      booking_id,
    });

    if (result?.data?.amount && result?.data?.instruction) {
      return handleSuccess(result.data); // always return result if values are valid
    } else {
      return handleFailure("Unexpected response from server.");
    }
  } catch (error) {
    console.error("simulatePayment error:", error?.response?.data || error.message);
    handleFailure(error?.response?.data?.error || "Payment simulation failed.");
  }
};

