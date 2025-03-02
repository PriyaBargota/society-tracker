import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/societyService';
import '../styling/Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '', // Changed from username to email to match backend
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { email, password } = formData;
      const userData = await login(email, password);
      
      // Store user data in localStorage (adjust based on what your backend returns)
      localStorage.setItem('user', JSON.stringify({
        email: userData.email,
        name: userData.name,
        accountType: userData.account_type
      }));
      
      // If parent component needs to know about the login
      if (onLogin) {
        onLogin(userData);
      }
      
      navigate('/');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Invalid email or password.');
      } else if (error.request) {
        setError('No response from the server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>Log in</h2> 
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email" // Changed to email type for better validation
                name="email" // Changed from username to email
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label> {/* Changed from Username to Email */}
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
            <button 
              type="submit" 
              className="auth-button" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;