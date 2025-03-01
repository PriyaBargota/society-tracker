import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to SocSync</h1>
        <p className="hero-subtitle">Your central hub for all university societies and events</p>
        <div className="hero-buttons">
          <Link to="/events" className="hero-button primary">Explore Events</Link>
          <Link to="/societies" className="hero-button secondary">Join Societies</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
