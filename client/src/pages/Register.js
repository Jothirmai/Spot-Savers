import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../api/api';
import { toast } from 'react-toastify';
import '../css/auth.scss';

// Assuming these SVG icons are available or you will include them
// as in the Login.js for the input fields.
// For simplicity, I'm using the same SVG paths as in the Login component.
const UserIcon = () => (
    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

const EmailIcon = () => (
    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12.713l-11.75 6.287c-.122.065-.259.1-.397.1-.252 0-.49-.101-.663-.284-.176-.188-.27-.433-.27-.692v-11.75c0-.552.448-1 1-1h22c.552 0 1 .448 1 1v11.75c0 .259-.094.504-.27.692-.173.183-.411.284-.663.284-.138 0-.275-.035-.397-.1l-11.75-6.287zm-10-2.713v-4.595l10.157 5.437-10.157-5.437zm20 0l-10.157 5.437 10.157-5.437v4.595zm0 1.287v6.75h-22v-6.75l11-5.882 11 5.882z"/>
    </svg>
);

const LockIcon = () => (
    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 11c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0-4c4.663 0 8.472 3.086 11.748 8-3.276 4.914-7.085 8-11.748 8s-8.472-3.086-11.748-8c3.276-4.914 7.085-8 11.748-8zm0 14c-1.579 0-3.155-.573-4.47-1.749-1.281-1.144-2.16-2.658-2.53-4.321h-.001c-.161-.722-.266-1.472-.279-2.23s.098-1.503.279-2.23l.001-.001c.371-1.663 1.25-3.177 2.53-4.321 1.315-1.176 2.891-1.749 4.47-1.749s3.155.573 4.47 1.749c1.281 1.144 2.16 2.658 2.53 4.321l.001.001c.161.722.266 1.472.279 2.23s-.098 1.503-.279 2.23l-.001.001c-.371 1.663-1.25 3.177-2.53 4.321-1.315 1.176-2.891 1.749-4.47-1.749z"/>
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 11c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0-4c4.663 0 8.472 3.086 11.748 8-3.276 4.914-7.085 8-11.748 8s-8.472-3.086-11.748-8c3.276-4.914 7.085-8 11.748-8zm0 14c-1.579 0-3.155-.573-4.47-1.749-1.281-1.144-2.16-2.658-2.53-4.321h-.001c-.161-.722-.266-1.472-.279-2.23s.098-1.503.279-2.23l.001-.001c.371-1.663 1.25-3.177 2.53-4.321 1.315-1.176 2.891-1.749 4.47-1.749s3.155.573 4.47 1.749c1.281 1.144 2.16 2.658 2.53 4.321l.001.001c.161.722.266 1.472.279 2.23s-.098 1.503-.279 2.23l-.001.001c-.371 1.663-1.25 3.177-2.53 4.321-1.315 1.176-2.891 1.749-4.47-1.749z"/>
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.394 13.743l-.934-.498 1.455-2.433c2.977-4.997 6.33-8.312 10.085-8.312 1.475 0 2.883.313 4.205.884l1.966-2.231 1.777 1.777-18.799 18.799-1.777-1.777 3.329-3.329c-3.167-1.481-5.696-3.801-7.701-6.155zm1.517-1.174c1.173 1.45 2.657 2.868 4.618 3.791l-3.351-3.351c-.69.055-1.378-.052-2.029-.387zm-.884.077c.361.35.772.636 1.216.859l-1.216-.859zm8.569 4.43c-1.685 0-3.355-.6-4.679-1.789l-2.427 2.427c2.476 1.671 5.378 2.64 7.106 2.64 4.093 0 7.113-2.613 9.771-6.398l-2.435-1.782c-2.339 3.037-4.887 4.8-9.345 4.8zm.01-6c.404.004.807.054 1.203.149l-1.203-.149zm-1.896 2.102l1.665-1.665c-.097-.474-.067-.977.086-1.442l-1.747-1.747c-.551.488-.99 1.054-1.341 1.679l1.437 1.437zm4.183-1.022l1.244-1.244c.488-.551 1.054-.99 1.679-1.341l-1.437-1.437-3.329 3.329zm-1.084-2.859c-.475-.098-.979-.067-1.443.086l-1.747-1.747c.488-.551 1.054-.99 1.679-1.341l-1.437-1.437zm-2.008-2.008c-.098-.475-.067-.979.086-1.443l-1.747-1.747c.488-.551 1.054-.99 1.679-1.341l-1.437-1.437-3.329 3.329z"/>
    </svg>
);


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(''); // 'owner' or 'seeker'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For password toggle

  const handleRegister = (e) => {
    e.preventDefault(); // Prevent default form submission
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
    // Optionally navigate to login page after successful registration
    // navigate('/login');
  };

  const handleRegisterFailure = (error) => {
    toast.error(error || 'Registration failed!');
    setLoading(false);
  };

  return (
    <div className='auth-page-wrapper'> {/* Use auth-page-wrapper for consistent background */}
      <div className='auth-container'>
        <div className='card login-card animate__animated animate__fadeInUp'> {/* Retain login-card for consistent styling */}
          {/* Left Panel (Branding/Marketing) */}
          <div className="login-left-panel">
            <h2 className="login-brand-logo">Spot-Savers</h2>
            <p className="login-tagline">Join Spot-Savers today and revolutionize your parking experience!</p>
          </div>

          {/* Right Panel (Register Form) */}
          <div className="login-right-panel">
            <h3 className='card-title text-center mb-4'>Create Your Account</h3> {/* Adjusted title */}
            <p className='card-subtitle text-center mb-4'>Get started with efficient parking management.</p>

            <form onSubmit={handleRegister}> {/* Use onSubmit for form submission */}
              <div className="mb-3 form-group">
                <label htmlFor="name">Name</label>
                <div className="input-with-icon">
                  <UserIcon />
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
                <label htmlFor="email">Email address</label>
                <div className="input-with-icon">
                  <EmailIcon />
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
                <label htmlFor="password">Password</label>
                <div className="input-with-icon password-toggle">
                  <LockIcon />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control password-input"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <div className="password-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </div>
                </div>
              </div>

              <div className="mb-4 form-group"> {/* Added margin-bottom to separate from button */}
                <label htmlFor="type">Account Type</label> {/* Changed label */}
                <div className="input-with-icon"> {/* Added for consistent styling if needed, though no icon for select */}
                  {/* You could add a dropdown icon here if desired */}
                  <select
                    className="form-control form-select" // Added form-select for Bootstrap styling
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Select Account Type</option> {/* More descriptive default */}
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
                    <span>Registering...</span>
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className='mt-4 text-center new-user-text'>
              Already have an account?{' '}
              <Link to='/login' className='register-link'>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;