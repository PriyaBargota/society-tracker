import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getSocieties } from '../api/societyService';
import './EventsPage.css';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [societies, setSocieties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await getEvents();
        const societiesData = await getSocieties();
        
        // Create a lookup object for societies
        const societiesLookup = {};
        societiesData.forEach(society => {
          societiesLookup[society.id] = society;
        });
        
        setSocieties(societiesLookup);
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredEvents = () => {
    // First filter by search term
    let filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then filter by time period if needed
    const now = new Date();
    
    if (filter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) > now);
    } else if (filter === 'today') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate < tomorrow;
      });
    } else if (filter === 'this-week') {
      const weekFromNow = new Date(now);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= weekFromNow;
      });
    } else if (filter === 'this-month') {
      const monthFromNow = new Date(now);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= monthFromNow;
      });
    }
    
    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Events Calendar</h1>
        <p>Discover upcoming events from societies across campus</p>
        
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button 
              className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button 
              className={`filter-btn ${filter === 'this-week' ? 'active' : ''}`}
              onClick={() => setFilter('this-week')}
            >
              This Week
            </button>
            <button 
              className={`filter-btn ${filter === 'this-month' ? 'active' : ''}`}
              onClick={() => setFilter('this-month')}
            >
              This Month
            </button>
            <button 
              className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              All Upcoming
            </button>
          </div>
        </div>
      </div>
      
      <div className="events-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link to={`/event/${event.id}`} key={event.id} className="event-card">
              <div className="event-date">
                <div className="date-day">{new Date(event.date).getDate()}</div>
                <div className="date-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
              </div>
              <div className="event-info">
                <h2>{event.title}</h2>
                <p className="event-society">
                  {societies[event.society]?.name || 'Unknown Society'}
                </p>
                <p className="event-time">
                  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="event-description">{event.description.substring(0, 150)}...</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            No events found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
