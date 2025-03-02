import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse or create a new CSS file for styling

function Login({ onLogin }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('username', response.data.username);
      if (onLogin) {
        onLogin(response.data.username);
      }
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        setError(error.response.data.error || 'Invalid username or password.');
      } else if (error.request) {
        setError('No response from the server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

// Updated structure for both components
    return (
        <div className="auth-container">
        <div className="auth-form-container">
            <div className="auth-form">
            <h2>Log in</h2> 
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <input
                    type="text"
                    name="username"
                    required
                />
                <label>Username</label>
                </div>
                <div className="form-group">
                <input
                    type="password"
                    name="password"
                    required
                />
                <label>Password</label>
                </div>
                <button type="submit" className="auth-button">Log in</button>
            </form>
            </div>
        </div>
        </div>
    );
}

export default Login;