import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/Hero.css';

function Hero() {
  return (
    <div className="hero">
      <div className="hero-floating-element"></div>
      <div className="hero-floating-element"></div>
      <div className="hero-floating-element"></div>
      
      <div className="hero-content">
        <h1 className="hero-title">Connect with University Societies</h1>
        <p className="hero-subtitle">
          Discover events, join communities, and make the most of your university experience with SocSync - your gateway to campus life
        </p>
        <div className="hero-buttons">
          <Link to="/societies" className="hero-button primary">
            Explore Societies
          </Link>
          <Link to="/calendar" className="hero-button secondary">
            View Events Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
