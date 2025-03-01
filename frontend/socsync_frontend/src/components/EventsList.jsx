import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getSocieties, getUniversities } from '../api/societyService';
import '../styling/EventsList.css';

function EventsList({ limit, filter, hideTitle, universityId }) {
  const [events, setEvents] = useState([]);
  const [societies, setSocieties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events, societies, and universities data
        const [eventsData, societiesData] = await Promise.all([
          getEvents(),
          getSocieties()
        ]);

        // Create a lookup object for societies
        const societiesLookup = {};
        societiesData.forEach(society => {
          societiesLookup[society.id] = society;
        });

        // Apply filters
        let filteredEvents = [...eventsData];

        if (filter === 'this-week') {
          // Get the start and end dates for the current week
          const today = new Date();
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(today);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
          endOfWeek.setHours(23, 59, 59, 999);

          // Filter events that fall within this week
          filteredEvents = eventsData.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
          });
        }

        // Filter by university if universityId is provided
        if (universityId) {
          filteredEvents = filteredEvents.filter(event => {
            const society = societiesLookup[event.society];
            return society && society.university.id === universityId;
          });
        }

        // Sort by date (closest first)
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Apply limit if provided
        if (limit) {
          filteredEvents = filteredEvents.slice(0, limit);
        }

        setSocieties(societiesLookup);
        setEvents(filteredEvents);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, filter, universityId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="events-loading">Loading events...</div>;
  if (error) return <div className="events-error">{error}</div>;

  return (
    <div className="events-list">
      {events.length === 0 ? (
        <p className="no-events">No upcoming events to display</p>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <Link to={`/event/${event.id}`} key={event.id} className="event-card">
              <div className="event-date">
                <span className="date-day">{new Date(event.date).getDate()}</span>
                <span className="date-month">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-time">
                  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="event-society">
                  {societies[event.society]?.name || 'Unknown Society'}
                </p>
                <p className="event-university">
                  {societies[event.society]?.university?.name || 'Unknown University'}
                </p>
                <p className="event-description">
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...` 
                    : event.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsList;