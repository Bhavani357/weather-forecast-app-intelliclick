import React, { useState, useEffect } from 'react';
import { City } from '../types/city';
import { fetchCities } from '../api/citiesApi';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  
  useEffect(() => {
    if (searchTerm.length > 2) {
      const loadSuggestions = async () => {
        const cities = await fetchCities(0); // Fetch the first page of cities
        const filteredCities = cities.filter((city: City) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filteredCities);
      };
      loadSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSelect = (cityName: string) => {
    setSearchTerm(cityName);
    setSuggestions([]);
    onSearch(cityName);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a city..."
        className="border p-2 w-full"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full max-h-40 overflow-auto">
          {suggestions.map((city: City) => (
            <li
              key={city.name}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(city.name)}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
