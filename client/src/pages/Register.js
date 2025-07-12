import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../api/api';
import { toast } from 'react-toastify';
import '../css/auth.scss';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    register({
      name,
      email,
      password,
      type,
      handleRegisterSuccess,
      handleRegisterFailure,
    });
  };

  const handleRegisterSuccess = () => {
    toast.success('Registration successful! Please login.');
    setLoading(false);
  };

  const handleRegisterFailure = (error) => {
    toast.error(error || 'Registration failed!');
    setLoading(false);
  };

  return (
    <div className='auth-page-wrapper'>
      <div className='auth-container'>
        <div className='card login-card animate__animated animate__fadeInUp'>
          <div className="login-left-panel">
            <h2 className="login-brand-logo">Spot-Savers</h2>
            <p className="login-tagline">Join Spot-Savers today and revolutionize your parking experience!</p>
          </div>

          <div className="login-right-panel">
            <h3 className='card-title text-center mb-4'>Create Your Account</h3>
            <p className='card-subtitle text-center mb-4'>Start managing parking the smart way.</p>

            <form onSubmit={handleRegister}>
              <div className="mb-3 form-group">
                <label htmlFor="name">🙍‍♂️ Full Name</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="mb-3 form-group">
                <label htmlFor="email">📧 Email Address</label>
                <div className="input-with-icon">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mb-3 form-group">
                <label htmlFor="password">🔒 Password</label>
                <div className="input-with-icon password-toggle">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control password-input"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-light password-eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="mb-4 form-group">
                <label htmlFor="type">Account Type</label>
                <div className="input-with-icon">
                  <select
                    className="form-control form-select"
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Select Account Type</option>
                    <option value="owner">Owner (List Parking Spots)</option>
                    <option value="seeker">Seeker (Find Parking Spots)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={`btn login-btn ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-container">
                    <svg
                      className="animate-spinner"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
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
                    <span className='ms-2'>Registering...</span>
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className='mt-4 text-center new-user-text'>
              Already have an account?{' '}
              <Link to='/login' className='register-link'>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
