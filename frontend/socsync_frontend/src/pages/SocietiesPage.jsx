import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSocieties } from '../api/societyService';
import './SocietiesPage.css';

function SocietiesPage() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const data = await getSocieties();
        setSocieties(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch societies');
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  const filteredSocieties = societies.filter(society =>
    society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    society.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading societies...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="societies-page">
      <div className="page-header">
        <h1>Discover Societies</h1>
        <p>Find and join societies that match your interests</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search societies..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="societies-grid">
        {filteredSocieties.length > 0 ? (
          filteredSocieties.map((society) => (
            <Link to={`/society/${society.id}`} key={society.id} className="society-card">
              <h2>{society.name}</h2>
              <p>{society.description}</p>
            </Link>
          ))
        ) : (
          <div className="no-results">No societies found matching "{searchTerm}"</div>
        )}
      </div>
    </div>
  );
}

export default SocietiesPage;
