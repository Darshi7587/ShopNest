import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import '../styles/auth.css';

const VerifyOtp = () => {
  const { user, login, logout } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      setMessage('Please login first.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, verified: true };
        login(updatedUser);
        setMessage('OTP verified successfully.');
        navigate('/profile');
      } else {
        setMessage(data.message || 'OTP verification failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Unable to verify OTP right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify OTP</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '10px' }}>
          Enter the OTP sent to your email.
        </p>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        {message && <p style={{ color: '#f97316', marginTop: '10px' }}>{message}</p>}
        <button type="button" onClick={handleLogout} className="btn" style={{ marginTop: '10px', background: '#3f3f46' }}>
          Logout
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
