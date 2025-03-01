import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById, getSocietyById } from '../api/societyService';
import './EventDetailPage.css';

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
        
        // Now fetch the society data
        const societyData = await getSocietyById(eventData.society);
        setSociety(societyData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!event) return <div className="error">Event not found</div>;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
  
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="event-detail-page">
      <div className="event-header">
        <div className="container">
          <h1>{event.title}</h1>
          <div className="event-meta">
            <div className="event-datetime">
              <i className="fas fa-calendar"></i> {formattedDate} at {formattedTime}
            </div>
            {society && (
              <div className="event-society-info">
                <i className="fas fa-users"></i> Organized by{" "}
                <Link to={`/society/${society.id}`}>{society.name}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="event-content container">
        <div className="event-details">
          <div className="event-description">
            <h2>About this event</h2>
            <p>{event.description}</p>
          </div>
          
          <div className="event-actions">
            <button className="btn primary">RSVP for Event</button>
            <button className="btn secondary">Add to Calendar</button>
          </div>
        </div>
        
        {society && (
          <div className="society-info-sidebar">
            <h3>About the organizer</h3>
            <Link to={`/society/${society.id}`} className="society-link">
              <h4>{society.name}</h4>
            </Link>
            <p>{society.description.substring(0, 150)}...</p>
            <Link to={`/society/${society.id}`} className="view-more">
              View Society Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailPage;
