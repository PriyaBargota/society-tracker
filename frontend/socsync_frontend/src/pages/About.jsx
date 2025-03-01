import React from 'react';
import '../styling/About.css';

function About() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About SocSync</h1>
        <p>Connecting students with societies and events at your university</p>
      </section>
      
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At SocSync, we're dedicated to enhancing student life by making it easier 
          to discover, join, and participate in university societies and events. 
          We believe that extracurricular involvement is a key part of the university 
          experience, helping students develop skills, pursue passions, and build 
          lasting friendships.
        </p>
      </section>
      
      <section className="about-features">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Society Discovery</h3>
            <p>Browse and search through all university societies in one place.</p>
          </div>
          <div className="feature-card">
            <h3>Event Calendar</h3>
            <p>Never miss an event with our comprehensive calendar system.</p>
          </div>
          <div className="feature-card">
            <h3>Easy Registration</h3>
            <p>Join societies and register for events with just a few clicks.</p>
          </div>
          <div className="feature-card">
            <h3>Personalized Feed</h3>
            <p>Get updates and recommendations based on your interests.</p>
          </div>
        </div>
      </section>
      
      <section className="about-team">
        <h2>Our Team</h2>
        <p>
          SocSync was created by a team of students who experienced firsthand the 
          challenges of navigating university societies. We're passionate about 
          improving student engagement and creating a more connected campus community.
        </p>
        <div className="team-members">
          {/* You can add team member cards here if desired */}
        </div>
      </section>
      
      <section className="about-contact">
        <h2>Get in Touch</h2>
        <p>
          Have questions, feedback, or suggestions? We'd love to hear from you!
        </p>
        <a href="mailto:contact@socsync.com" className="contact-button">
          Contact Us
        </a>
      </section>
    </div>
  );
}

export default About;