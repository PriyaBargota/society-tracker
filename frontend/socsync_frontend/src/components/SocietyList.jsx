import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSocieties } from '../api/societyService';
import './SocietyList.css';

function SocietyList({ filter = 'all', limit = null }) {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const data = await getSocieties();
        setSocieties(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load societies');
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  if (loading) return <div className="loading">Loading societies...</div>;
  if (error) return <div className="error">{error}</div>;

  let filteredSocieties = societies;
  
  // Apply filters if needed (this is a placeholder - you'd need to add category to your Society model)
  if (filter !== 'all') {
    // This is a simplified example; you might want to add a category field to your Society model
    filteredSocieties = societies.filter(society => 
      society.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
  
  // Apply limit if specified
  if (limit && limit > 0) {
    filteredSocieties = filteredSocieties.slice(0, limit);
  }

  return (
    <div className="society-list">
      {filteredSocieties.length > 0 ? (
        filteredSocieties.map(society => (
          <Link key={society.id} to={`/society/${society.id}`} className="society-card">
            <h3>{society.name}</h3>
            <p>{society.description.substring(0, 100)}...</p>
            <div className="society-card-footer">
              <span className="view-more">View Society</span>
            </div>
          </Link>
        ))
      ) : (
        <div className="empty-message">No societies found.</div>
      )}
    </div>
  );
}

export default SocietyList;