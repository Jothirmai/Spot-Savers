import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { setUser } from '../reducers/userReducer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/auth.scss';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    login({
      email,
      password,
      handleLoginSuccess,
      handleLoginFailure,
    });
  };

  const handleLoginSuccess = (data) => {
    dispatch(setUser({ ...data?.user, token: data?.token }));
    toast.success('Login successful! Welcome back.');
    setLoading(false);
    navigate('/');
  };

  const handleLoginFailure = (error) => {
    toast.error(error || 'Login failed! Please check your credentials.');
    setLoading(false);
  };

  return (
    <div className='auth-page-wrapper'>
      <div className='auth-container'>
        <div className='card login-card animate__animated animate__fadeInUp'>

          {/* Left Panel */}
          <div className="login-left-panel">
            <h2 className="login-brand-logo">Spot-Savers</h2>
            <p className="login-tagline">Your ultimate destination to find or list parking spots efficiently.</p>
          </div>

          {/* Right Panel */}
          <div className="login-right-panel">
            <h3 className='card-title text-center mb-4'>Login to Your Account</h3>
            <p className='card-subtitle text-center mb-4'>Securely access your parking management.</p>

            <form onSubmit={handleLogin}>
              <div className="mb-3 form-group">
                <label htmlFor="email">📧 Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4 form-group position-relative">
                <label htmlFor="pass">🔒 Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-eye-icon"
                  style={{ zIndex: 2 }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
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
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className='mt-4 text-center new-user-text'>
              Don't have an account?{' '}
              <Link to='/register' className='register-link'>Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
