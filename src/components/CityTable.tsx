import React, { useEffect, useState } from 'react';
import { fetchCities } from '../api/citiesApi';
import { useCitySearch } from '../hooks/useCitySearch';
import { useCities } from '../context/CitiesContext';
import { City } from '../types/city';
import { SearchBar } from './SearchBar';

export const CityTable: React.FC = () => {
  const { cities, setCities } = useCities();
//   const { searchTerm, setSearchTerm, sortBy, setSortBy, filterCities } = useCitySearch();
  const { setSearchTerm, setSortBy, filterCities } = useCitySearch();

  const [page, setPage] = useState(0);

  useEffect(() => {
    const loadCities = async () => {
      const newCities = await fetchCities(page);
      setCities((prev) => [...prev, ...newCities]);
    };
    loadCities();
  }, [page, setCities]);

  // Handle the search term change
  const handleSearch = (cityName: string) => {
    setSearchTerm(cityName);
    // Optionally, you can also reset the page to 0 if you want to start fresh on search
    setPage(0);
    // Fetch cities based on the search term
    fetchCities(0).then((data) => {
      const filteredCities = data.filter((city: City) =>
        city.name.toLowerCase().includes(cityName.toLowerCase())
      );
      setCities(filteredCities);
    });
  };

  // Filtered cities based on the search term
  const filteredCities = filterCities(cities);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th onClick={() => setSortBy('name')}>City Name</th>
            <th onClick={() => setSortBy('country')}>Country</th>
            <th onClick={() => setSortBy('timezone')}>Timezone</th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.map((city: City) => (
            <tr key={city.name}>
              <td>
                <a href={`/weather/${city.name}`} className="text-blue-500 hover:underline">
                  {city.name}
                </a>
              </td>
              <td>{city.country}</td>
              <td>{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage((prev) => prev + 1)} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Load More
      </button>
    </div>
  );
};
