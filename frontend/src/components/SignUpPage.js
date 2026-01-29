import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiCall } from '../config/api';
import './Signup.css';

const SignUpPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    rollnumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!form.email.endsWith('@iitj.ac.in')) {
      setError("Please use your IIT Jodhpur email (@iitj.ac.in).");
      return;
    }

    setLoading(true);

    try {
      const data = await apiCall(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify({
          roll_number: form.rollnumber,
          u_name: form.username,
          mail: form.email,
          pass: form.password,
        }),
      });

      setSuccessMessage("Sign-up successful! Redirecting to login...");

      // Clear form
      setForm({
        username: '',
        rollnumber: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError(error.message || 'Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Email (IIT Jodhpur)</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="yourname@iitj.ac.in"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Roll Number</label>
          <input
            type="text"
            name="rollnumber"
            value={form.rollnumber}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password (min 8 characters)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="google-signup">
        <button className="google-btn">Sign Up with Google</button>
      </div>
    </div>
  );
};

export default SignUpPage;
