import React from 'react';
import { CityTable } from '../components/CityTable';
import '../components/index.css';

const Home: React.FC = () => {
  return (
    <div>
      <h1 className='heading'>Weather Forecast App</h1>
      <CityTable />
    </div>
  );
};

export default Home;
