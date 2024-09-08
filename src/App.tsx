import React from 'react';
import {Routes,Route,BrowserRouter} from 'react-router-dom';
import { CitiesProvider } from './context/CitiesContext';
import Home from './pages/Home';
import CityWeather from './pages/CityWeather';
import Favorites from './pages/Favorites';

const App: React.FC = () => {
  return (
    <CitiesProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/weather/:name' element={<CityWeather />}/>
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      </BrowserRouter>
      
    </CitiesProvider>
  );
};

export default App;
