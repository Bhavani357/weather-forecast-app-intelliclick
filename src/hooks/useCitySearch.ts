import { useState } from 'react';
import { City } from '../types/city';

export const useCitySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'timezone'>('name');
  
  const filterCities = (cities: City[]) => {
    return cities.filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
                 .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  };
  
  return { searchTerm, setSearchTerm, sortBy, setSortBy, filterCities };
};
