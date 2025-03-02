import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Import the CSS file

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;  // At least 8 chars, 1 letter, 1 number
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Password:', formData.password);
    console.log('Validation Result:', validatePassword(formData.password));
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and include at least one letter and one number.');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
      console.log('User registered:', response.data);
      navigate('/login'); // Redirect to the login page after successful registration
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      setError('Registration failed. Please check your details and try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>Sign Up</h2> {/* Change to "Login" for Login.jsx */}
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label>Username</label>
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Password</label>
            </div>
            <button type="submit" className="auth-button">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;