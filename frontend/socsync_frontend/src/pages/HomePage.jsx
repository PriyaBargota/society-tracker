import { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SocietyList from '../components/SocietyList';
import Calendar from '../components/Calendar';
import EventsList from '../components/EventsList';
import './HomePage.css';

function HomePage() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="home-page">
      <Hero />
      
      <section id="featured-societies" className="section">
        <div className="container">
          <h2 className="section-title">Featured Societies</h2>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'academic' ? 'active' : ''}`}
              onClick={() => setFilter('academic')}
            >
              Academic
            </button>
            <button 
              className={`filter-btn ${filter === 'cultural' ? 'active' : ''}`}
              onClick={() => setFilter('cultural')}
            >
              Cultural
            </button>
            <button 
              className={`filter-btn ${filter === 'sports' ? 'active' : ''}`}
              onClick={() => setFilter('sports')}
            >
              Sports
            </button>
            <button 
              className={`filter-btn ${filter === 'arts' ? 'active' : ''}`}
              onClick={() => setFilter('arts')}
            >
              Arts
            </button>
          </div>
          
          <SocietyList filter={filter} />
          
          <div className="view-all-container">
            <Link to="/societies" className="view-all-link">
              View All Societies <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
      
      <section id="calendar-section" className="section calendar-section">
        <div className="container">
          <h2 className="section-title">Events Calendar</h2>
          <div className="calendar-container">
            <Calendar />
          </div>
        </div>
      </section>
      
      <section id="upcoming-events" className="section">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <EventsList limit={4} />
          <div className="view-all-container">
            <Link to="/events" className="view-all-link">
              View All Events <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
      
      <section id="about" className="section about-section">
        <div className="container">
          <h2 className="section-title">About SocSync</h2>
          <p className="about-description">
            SocSync is the central platform for all university societies to share their events and for students to discover activities that match their interests. Our mission is to enhance student engagement and create a vibrant campus community.
          </p>
          <div className="stats-container">
            <div className="stat-card">
              <h3 className="stat-number">50+</h3>
              <p className="stat-label">Active Societies</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">200+</h3>
              <p className="stat-label">Monthly Events</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">5000+</h3>
              <p className="stat-label">Student Members</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
