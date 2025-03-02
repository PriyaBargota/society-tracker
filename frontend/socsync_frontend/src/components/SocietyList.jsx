import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSocieties } from '../api/societyService';
import '../styling/SocietyList.css';

function SocietyList({ filter, random, limit }) {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const data = await getSocieties();
        
        let filteredSocieties = [...data];
        if (filter && filter !== 'all') {
          filteredSocieties = data.filter(society => society.category === filter);
        }

        if (random) {
          for (let i = filteredSocieties.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredSocieties[i], filteredSocieties[j]] = [filteredSocieties[j], filteredSocieties[i]];
          }
        }
        
        if (limit && limit > 0) {
          filteredSocieties = filteredSocieties.slice(0, limit);
        }
        
        setSocieties(filteredSocieties);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch societies:', err);
        setError('Failed to load societies');
        setLoading(false);
      }
    };
    
    fetchSocieties();
  }, [filter, random, limit]);

  if (loading) return <div className="society-loading">Loading societies...</div>;
  if (error) return <div className="society-error">{error}</div>;

  return (
    <div className="society-list">
      {societies.length === 0 ? (
        <p className="no-societies">No societies found.</p>
      ) : (
        <div className="societies-grid">
          {societies.map(society => (
            <Link to={`/society/${society.id}`} key={society.id} className="society-card">
              {society.logo_url && (
                <div className="society-logo">
                  <img src={society.logo_url} alt={`${society.name} logo`} />
                </div>
              )}
              <div className="society-content">
                <h3 className="society-name">{society.name}</h3>
                {society.category && (
                  <span className="society-category">{society.category}</span>
                )}
                <p className="society-description">
                  {society.description.length > 100
                    ? `${society.description.substring(0, 100)}...`
                    : society.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SocietyList;