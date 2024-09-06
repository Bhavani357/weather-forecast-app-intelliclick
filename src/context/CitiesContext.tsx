import React, { createContext, useState, useContext } from 'react';
import { City } from '../types/city';

interface CitiesContextType {
  cities: City[];
  setCities: React.Dispatch<React.SetStateAction<City[]>>;
}

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

export const useCities = () => {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error('useCities must be used within a CitiesProvider');
  }
  return context;
};

export const CitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  return (
    <CitiesContext.Provider value={{ cities, setCities }}>
      {children}
    </CitiesContext.Provider>
  );
};
