import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getUniversities } from '../api/societyService';
import '../styling/SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    password_confirm: '',
    university: '',
    account_type: 'student'
  });
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch universities when component mounts
    const fetchUniversities = async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);
        // Set default university if available
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, university: data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load universities:', err);
      }
    };

    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.password_confirm) {
      setError("Passwords don't match");
      return false;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await register(formData);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        // Handle specific validation errors from backend
        if (typeof error.response.data === 'object') {
          const errorMessages = Object.values(error.response.data).flat();
          setError(errorMessages.join(' '));
        } else {
          setError(error.response.data);
        }
      } else {
        setError('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>Sign Up</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Full Name</label>
            </div>
            
            <div className="form-group">
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
              >
                {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
                ))}
              </select>
              <label className="select-label">University</label>
            </div>
            
            <div className="form-group radio-group">
              <label>Account Type:</label>
              <div className="radio-options">
                <label>
                  <input 
                    type="radio" 
                    name="account_type" 
                    value="student" 
                    checked={formData.account_type === 'student'} 
                    onChange={handleChange} 
                  />
                  Student
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="account_type" 
                    value="president" 
                    checked={formData.account_type === 'president'} 
                    onChange={handleChange} 
                  />
                  Society President
                </label>
              </div>
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
            
            <div className="form-group">
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
              />
              <label>Confirm Password</label>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;