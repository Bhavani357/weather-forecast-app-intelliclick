import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites] = React.useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div className="favorites-wrapper">
      <div className="favorites-container">
        <h2 className="favorites-heading">Favorites</h2>
        {favorites.length > 0 ? (
          <ul className="favorites-list">
            {favorites.map((city, index) => (
              <li key={index} className="favorites-item">
                <Link to={`/weather/${city}`} className="favorites-link">
                  {city}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-favorites">No favorite cities yet.</p>
        )}
        <div className="button-container">
          <button onClick={() => navigate("/")} className="nav-button">
            Go to Table Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
