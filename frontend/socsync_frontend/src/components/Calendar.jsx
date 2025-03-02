import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getSocieties } from '../api/societyService';
import '../styling/Calendar.css';

function Calendar({ universityId }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [societies, setSocieties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [eventsData, societiesData] = await Promise.all([
          getEvents(),
          getSocieties()
        ]);

        // Create a lookup object for societies
        const societiesLookup = {};
        societiesData.forEach(society => {
          societiesLookup[society.id] = society;
        });

        // Filter by university if universityId is provided
        let filteredEvents = eventsData;
        if (universityId) {
          filteredEvents = eventsData.filter(event => {
            const society = societiesLookup[event.society];
            return society && society.university.id === universityId;
          });
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

    fetchEvents();
  }, [universityId]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date().getDate());
  };

  const renderHeader = () => {
    const dateFormat = { month: 'long', year: 'numeric' };
    
    return (
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={prevMonth}>&lt;</button>
          <h2>{currentMonth.toLocaleDateString('en-US', dateFormat)}</h2>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <button className="today-button" onClick={goToToday}>Today</button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="calendar-days">
        {days.map(day => (
          <div className="day-name" key={day}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const getEventsForDate = (date, month, year) => {
    if (!events) return [];

    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    const rows = [];

    let days = [];
    let day = startDate;
    
    // Adjust start date to begin with the appropriate day of the week
    startDate.setDate(1 - getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()));

    // Create weeks
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateNum = day.getDate();
        const month = day.getMonth();
        const year = day.getFullYear();
        const dayEvents = getEventsForDate(dateNum, month, year);
        
        const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
        const isToday = new Date().toDateString() === day.toDateString();
        const isSelected = selectedDate === dateNum && isCurrentMonth;
        
        days.push(
          <div 
            className={`calendar-cell ${!isCurrentMonth ? 'disabled' : ''} 
                      ${isToday ? 'today' : ''} 
                      ${isSelected ? 'selected' : ''}`} 
            key={day.toString()}
            onClick={() => isCurrentMonth && setSelectedDate(dateNum)}
          >
            <span className="day-number">{dateNum}</span>
            <div className="events-container">
              {dayEvents.slice(0, 3).map(event => (
                <Link 
                  to={`/event/${event.id}`} 
                  key={event.id} 
                  className="event-indicator"
                  title={event.title}
                >
                  <div className="event-dot"></div>
                  <span className="event-title">{event.title}</span>
                  <span className="event-university">
                    {societies[event.society]?.university?.name || 'Unknown University'}
                  </span>
                </Link>
              ))}
              {dayEvents.length > 3 && (
                <Link to={`/events?date=${year}-${month+1}-${dateNum}`} className="more-events">
                  +{dayEvents.length - 3} more
                </Link>
              )}
            </div>
          </div>
        );
        
        day = new Date(day);
        day.setDate(day.getDate() + 1);
      }
      
      rows.push(
        <div className="calendar-row" key={day.toString()}>
          {days}
        </div>
      );
      
      days = [];
    }
    
    return <div className="calendar-body">{rows}</div>;
  };

  if (loading) return <div className="calendar-loading">Loading your events calendar...</div>;
  if (error) return <div className="calendar-error">{error}</div>;

  return (
    <div className="calendar-container">
      <h2>Events Calendar</h2>
      <div className="calendar">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}

export default Calendar;