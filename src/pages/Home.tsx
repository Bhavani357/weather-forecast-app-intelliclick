import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CityTable } from '../components/CityTable';
import './index.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='header'>
        <div className='heading'>
          <h1>Weather Forecast App</h1>
        </div>
        <div className='fav-button-container'>
          <button onClick={() => navigate("/favorites")} className='button'>
            View Favorites
          </button>
        </div>
      </div>
      <CityTable />
    </>
  );
};

export default Home;
