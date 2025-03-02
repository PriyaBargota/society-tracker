import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSocieties } from '../api/societyService';
import '../styling/SocietiesPage.css';

function SocietiesPage() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const data = await getSocieties();
        console.log('Fetched societies:', data); // Debug line
        setSocieties(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch societies:', err);
        setError('Failed to fetch societies. Please try again later.');
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  const validSocieties = societies.filter(society => society.university !== null);
  // Filter societies based on search term and category filter
  const filteredSocieties = validSocieties
    .filter(society => 
      (society.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      society.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === 'all' || society.category === filter)
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'university') {
        return a.university.name.localeCompare(b.university.name);
      }
      return 0;
    });

  // Get unique categories for filter pills
  const categories = ['all', ...new Set(validSocieties.map(society => society.category).filter(Boolean))];

  if (loading) return (
    <div className="societies-page">
      <div className="page-header">
        <h1>Discover Societies</h1>
        <p>Find and join societies that match your interests</p>
      </div>
      <div className="loading">Loading societies...</div>
    </div>
  );

  if (error) return (
    <div className="societies-page">
      <div className="page-header">
        <h1>Discover Societies</h1>
        <p>Find and join societies that match your interests</p>
      </div>
      <div className="error">{error}</div>
    </div>
  );

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
      
      <div className="sort-filter-container">
        <div className="filter-pills">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-pill ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
        
        <div className="sort-options">
          <span className="sort-label">Sort by:</span>
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Society Name</option>
            <option value="university">University</option>
          </select>
        </div>
      </div>
      
      <div className="societies-grid">
        {filteredSocieties.length > 0 ? (
          filteredSocieties.map((society) => (
            <Link to={`/society/${society.id}`} key={society.id} className="society-card">
              <h2>{society.name}</h2>
              
              <div className="university-tag">
                <i className="fas fa-university"></i>
                <span>{society.university ? society.university.name : 'Unknown University'}</span>
              </div>
              
              {society.category && (
                <div className="status-badge">
                  {society.category}
                </div>
              )}
              
              <p>{society.description}</p>
            </Link>
          ))
        ) : (
          <div className="no-results">
            No societies found matching "{searchTerm}"
            {filter !== 'all' && ` in category "${filter}"`}
          </div>
        )}
      </div>
    </div>
  );
}

export default SocietiesPage;