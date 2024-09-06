import React from 'react';
import { CitiesProvider } from './context/CitiesContext';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <CitiesProvider>
      <Home />
    </CitiesProvider>
  );
};

export default App;
