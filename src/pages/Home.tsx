import React from 'react';
import { CityTable } from '../components/CityTable';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Weather Forecast App</h1>
      <CityTable />
    </div>
  );
};

export default Home;
