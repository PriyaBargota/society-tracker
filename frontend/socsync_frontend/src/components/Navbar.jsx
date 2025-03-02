import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = localStorage.getItem('username');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.reload(); // Refresh the page to update the navbar
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>SocSync</h1>
        </Link>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
        
        <nav className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
          <ul className="navbar-items">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Home</Link>
            </li>
            <li className="navbar-item">
              <Link to="/societies" className="navbar-link">Societies</Link>
            </li>
            <li className="navbar-item">
              <Link to="/calendar" className="navbar-link">Calendar</Link>
            </li>
            <li className="navbar-item">
              <Link to="/events" className="navbar-link">Events</Link>
            </li>
            <li className="navbar-item">
              <Link to="/about" className="navbar-link">About</Link>
            </li>
          </ul>
          <div className="navbar-buttons">
            {username ? (
              <>
                <Link to="#" className="navbar-username">Hello, {username}</Link>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;