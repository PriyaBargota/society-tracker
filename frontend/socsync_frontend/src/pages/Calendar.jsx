import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents, getSocieties } from '../api/societyService';
import '../styling/Calendar.css';

function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [societies, setSocieties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [view, setView] = useState('month'); // 'month', 'week', or 'day'
  
  const navigate = useNavigate();

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
        console.error('Failed to fetch data:', err);
        setError('Failed to load calendar data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedEvents([]);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedEvents([]);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    const today = new Date().getDate();
    setSelectedDate(today);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const todayEvents = getEventsForDate(today, currentMonth, currentYear);
    setSelectedEvents(todayEvents);
  };

  const changeView = (newView) => {
    setView(newView);
  };

  const renderViewSwitcher = () => {
    return (
      <div className="calendar-view-switcher">
        <button 
          className={`view-btn ${view === 'month' ? 'active' : ''}`} 
          onClick={() => changeView('month')}
        >
          Month
        </button>
        <button 
          className={`view-btn ${view === 'week' ? 'active' : ''}`} 
          onClick={() => changeView('week')}
        >
          Week
        </button>
        <button 
          className={`view-btn ${view === 'day' ? 'active' : ''}`} 
          onClick={() => changeView('day')}
        >
          Day
        </button>
      </div>
    );
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
        <div className="calendar-controls">
          {renderViewSwitcher()}
          <button className="today-button" onClick={goToToday}>Today</button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return (
      <div className="calendar-days">
        {days.map(day => (
          <div className="day-name" key={day}>
            {view === 'month' ? day.slice(0, 3) : day}
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

  const handleDateClick = (date, month, year) => {
    setSelectedDate(date);
    const dayEvents = getEventsForDate(date, month, year);
    setSelectedEvents(dayEvents);
    
    if (view === 'month' && dayEvents.length > 0) {
      setView('day');
    }
  };

  const renderMonthView = () => {
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
            onClick={() => isCurrentMonth && handleDateClick(dateNum, month, year)}
          >
            <span className="day-number">{dateNum}</span>
            <div className="events-container">
              {dayEvents.slice(0, 3).map(event => (
                <Link 
                  to={`/event/${event.id}`} 
                  key={event.id} 
                  className="event-indicator"
                  title={event.title}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="event-dot"></div>
                  <span className="event-title">{event.title}</span>
                </Link>
              ))}
              {dayEvents.length > 3 && (
                <div className="more-events">
                  +{dayEvents.length - 3} more events
                </div>
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
    
    return <div className="calendar-body month-view">{rows}</div>;
  };

  const renderWeekView = () => {
    // Get the start of the week for the current date
    const now = new Date(currentMonth);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    const days = [];
    const currentDate = new Date(startOfWeek);
    
    // Create 7 days starting from the start of the week
    for (let i = 0; i < 7; i++) {
      const dateNum = currentDate.getDate();
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      const dayEvents = getEventsForDate(dateNum, month, year);
      const isToday = new Date().toDateString() === currentDate.toDateString();
      
      days.push(
        <div 
          className={`week-day ${isToday ? 'today' : ''}`} 
          key={currentDate.toString()}
        >
          <div className="week-date">
            <span className="week-day-name">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()]}</span>
            <span className="week-date-number">{dateNum}</span>
          </div>
          <div className="week-events">
            {dayEvents.map(event => (
              <Link 
                to={`/event/${event.id}`} 
                key={event.id} 
                className="week-event"
              >
                <div className="event-time">
                  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="event-details">
                  <div className="event-title">{event.title}</div>
                  <div className="event-society">
                    {societies[event.society]?.name || 'Unknown Society'}
                  </div>
                </div>
              </Link>
            ))}
            {dayEvents.length === 0 && <div className="no-events">No events</div>}
          </div>
        </div>
      );
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return <div className="calendar-body week-view">{days}</div>;
  };

  const renderDayView = () => {
    // If no date is selected, use current date
    const targetDate = selectedDate ? 
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate) : 
      new Date();
      
    const dateNum = targetDate.getDate();
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    const dayEvents = getEventsForDate(dateNum, month, year);
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <div className="calendar-body day-view">
        <h3 className="day-view-date">{dateFormatter.format(targetDate)}</h3>
        
        <div className="day-schedule">
          {dayEvents.length > 0 ? (
            dayEvents.map(event => (
              <Link 
                to={`/event/${event.id}`} 
                key={event.id} 
                className="day-event"
              >
                <div className="event-time">
                  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="event-details">
                  <h4 className="event-title">{event.title}</h4>
                  <div className="event-society">
                    {societies[event.society]?.name || 'Unknown Society'}
                  </div>
                  <p className="event-description">{event.description}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-events-day">No events scheduled for this day</div>
          )}
        </div>
      </div>
    );
  };

  const renderCalendarView = () => {
    switch (view) {
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      case 'month':
      default:
        return renderMonthView();
    }
  };

  if (loading) return (
    <div className="calendar-page">
      <div className="calendar-loading">
        <div className="loading-spinner"></div>
        <div>Loading your calendar...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="calendar-page">
      <div className="calendar-error">
        <div>{error}</div>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="calendar-page">
      <div className="calendar-container fullscreen">
        {renderHeader()}
        {view !== 'day' && renderDays()}
        {renderCalendarView()}
      </div>
    </div>
  );
}

export default CalendarPage;