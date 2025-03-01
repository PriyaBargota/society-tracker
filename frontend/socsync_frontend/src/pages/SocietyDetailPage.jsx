import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSocietyById, getSocietyEvents } from '../api/societyService';
import './SocietyDetailPage.css';

function SocietyDetailPage() {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocietyData = async () => {
      try {
        const societyData = await getSocietyById(id);
        const eventsData = await getSocietyEvents(id);
        
        setSociety(societyData);
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch society details');
        setLoading(false);
      }
    };

    fetchSocietyData();
  }, [id]);

  if (loading) return <div className="loading">Loading society details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!society) return <div className="error">Society not found</div>;

  return (
    <div className="society-detail-page">
      <div className="society-header">
        <div className="container">
          <h1>{society.name}</h1>
          <div className="society-actions">
            <button className="btn primary">Join Society</button>
            <button className="btn secondary">Follow</button>
          </div>
        </div>
      </div>
      
      <div className="society-content container">
        <div className="society-info">
          <div className="society-description">
            <h2>About</h2>
            <p>{society.description}</p>
          </div>
          
          <div className="society-events">
            <h2>Upcoming Events</h2>
            {events.length > 0 ? (
              <div className="events-list">
                {events.map(event => (
                  <Link to={`/event/${event.id}`} key={event.id} className="event-card">
                    <div className="event-date">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p>{event.description.substring(0, 100)}...</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No upcoming events scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocietyDetailPage;
