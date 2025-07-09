import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, updateUser } from '../api/api';
import { setUser } from '../reducers/userReducer';
import { toast } from 'react-toastify';
import '../css/createParking.scss';

const spinnerSVG = (
  <svg
    className="animate-spinner me-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="20"
    height="20"
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
);

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
    cash: false,
    upiID: ''
  });

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleFormChange = ({ key, value }) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateUserPassword = () => {
    if (form.cash === user.cash && form.upiID === user.upiID) {
      toast.info("No changes to update");
      return;
    }

    setLoadingUpdate(true);
    const body = { cash: form.cash, upiID: form.upiID };

    updateUser({
      user_id: user?._id,
      body,
      handleUpdateUserSuccess,
      handleUpdateUserFailure
    });
  };

  const handleUpdateUserSuccess = (data) => {
    dispatch(setUser({ ...user, ...data?.user }));
    toast.success("Profile updated successfully");
    setLoadingUpdate(false);
  };

  const handleUpdateUserFailure = (error) => {
    toast.error(error || "Update failed");
    setLoadingUpdate(false);
  };

  const handleResetPassword = () => {
    setLoadingReset(true);

    if (form?.password !== form?.confirmPassword) {
      toast.error("Passwords do not match");
      setLoadingReset(false);
      return;
    }

    const body = {
      password: form.password,
      cash: form.cash,
      upiID: form.upiID
    };

    resetPassword({
      user_id: user?._id,
      body,
      handleResetPasswordSuccess,
      handleResetPasswordFailure
    });
  };

  const handleResetPasswordSuccess = () => {
    toast.success("Password changed successfully");
    setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    setLoadingReset(false);
  };

  const handleResetPasswordFailure = (error) => {
    toast.error(error || "Password reset failed");
    setLoadingReset(false);
  };

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      type: user?.type || '',
      cash: user?.cash || false,
      upiID: user?.upiID || '',
      password: '',
      confirmPassword: ''
    });
  }, [user]);

  return (
    <div className='container py-5'>
      <div className='card create-parking-card p-5'>
        <h3 className='mb-4'>Manage Profile</h3>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" value={form?.name} disabled />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="text" className="form-control" id="email" value={form?.email} disabled />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type</label>
          <input type="text" className="form-control" id="type" value={form?.type} disabled />
        </div>

        {user?.type === 'owner' &&
          <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <label className="form-check-label" htmlFor="cashCheck">Accepts cash</label>
              <input
                className="form-check-input"
                type="checkbox"
                id="cashCheck"
                checked={form?.cash}
                onChange={(e) => handleFormChange({ key: 'cash', value: e.target.checked })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="upiID" className="form-label">upiID</label>
              <input
                type="text"
                className="form-control"
                id="upiID"
                value={form?.upiID}
                onChange={(e) => handleFormChange({ key: 'upiID', value: e.target.value })}
              />
            </div>
          </>
        }

        <button
          type="submit"
          className="btn btn-primary mt-4 mb-4 d-flex align-items-center justify-content-center"
          onClick={handleUpdateUserPassword}
          disabled={loadingUpdate}
        >
          {loadingUpdate ? spinnerSVG : 'Update'}
        </button>

        <h3 className='mt-3'>Change Password</h3>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={form?.password}
            onChange={(e) => handleFormChange({ key: 'password', value: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={form?.confirmPassword}
            onChange={(e) => handleFormChange({ key: 'confirmPassword', value: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-4 d-flex align-items-center justify-content-center"
          onClick={handleResetPassword}
          disabled={loadingReset}
        >
          {loadingReset ? spinnerSVG : 'Change Password'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
