import {useState} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SocietiesPage from './pages/SocietiesPage';
import SocietyDetailPage from './pages/SocietyDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import Calendar from './pages/Calendar';
import About from './pages/About';
import SignUp from './components/SignUp'
import Login from './components/Login';
import './App.css';
import React from 'react';

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogin = (username) => {
    localStorage.setItem('username', username);
    setUsername(username); // Update the state to trigger a re-render
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null); // Update the state to trigger a re-render
  };
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/societies" element={<SocietiesPage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/society/:id" element={<SocietyDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/about" element={<About />} />
            <Route path= "/signup" element={<SignUp />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {/* Additional routes can be added here */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
