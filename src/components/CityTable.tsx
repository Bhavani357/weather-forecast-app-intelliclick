import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { fetchCities } from '../api/citiesApi';
import { useCities } from '../context/CitiesContext';
import { City } from '../types/city';
import { ArrowDownUp, Filter, X as XMarkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation within the app

import './index.css';

type SortOrder = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof City;
  order: SortOrder;
}

export const CityTable: React.FC = () => {
  const { cities, setCities } = useCities();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCityRef = useRef<HTMLTableRowElement | null>(null);
  const [filters, setFilters] = useState<Partial<Record<keyof City, string>>>({});
  const [popupFilter, setPopupFilter] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the input field
  
  const loadedPages = useRef<Set<number>>(new Set());
  
  const navigate = useNavigate(); // Use useNavigate for in-app navigation

  const loadCities = useCallback(async () => {
    if (loading || !hasMore || loadedPages.current.has(page)) return;

    setLoading(true);

    try {
      const newCities = await fetchCities(page);
      
      // If no more cities are returned, stop further fetches
      if (newCities.length === 0) {
        setHasMore(false); // No more data to load
        observer.current?.disconnect(); // Stop observing when no more data
      } else {
        setCities((prev) => [...prev, ...newCities]);
        loadedPages.current.add(page); // Mark page as loaded
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, setCities]);

  useEffect(() => {
    loadCities();
  }, [page, loadCities]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !loading && hasMore) {
          setPage((prevPage) => prevPage + 10); // Increment page number when the last row is visible
        }
      },
      {
        root: null,
        rootMargin: '200px', // Trigger the observer before the bottom is reached
        threshold: 0.1,
      }
    );

    if (lastCityRef.current && hasMore) {
      observer.current.observe(lastCityRef.current);
    }

    return () => observer.current?.disconnect();
  }, [loading, hasMore]);

  const handleSort = (key: keyof City) => {
    let order: SortOrder = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.order === 'desc') {
      order = null; 
    }
    setSortConfig(order ? { key, order } : null);
  };

  const sortedCities = useMemo(() => {
    if (!sortConfig) return cities;

    const sorted = [...cities].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return sorted;
  }, [cities, sortConfig]);

  const filteredCities = useMemo(() => {
    return sortedCities.filter((city) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const cityValue = String(city[key as keyof City]).toLowerCase();
        return cityValue.includes(value.toLowerCase());
      });
    });
  }, [sortedCities, filters]);

  const togglePopupFilter = () => {
    setPopupFilter((prev) => !prev);
  };

  const handleFilterChange = (key: keyof City, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (popupFilter && inputRef.current) {
      inputRef.current.focus(); // Focus the input field when the popup is shown
    }
  }, [popupFilter]);

  const handleCityClick = (cityName: string, event: React.MouseEvent) => {
    if (event.button === 0) {
      // Left-click: navigate to city weather page within the app
      navigate(`/weather/${cityName}`);
    } else if (event.button === 1) {
      // Middle-click or right-click: let the default browser behavior open in a new tab
      return;
    }
  };

  return (
    <div className="main-container">
      {popupFilter && (
        <div className='popup-container'>
          <input 
            ref={inputRef}
            type='text' 
            value={filters['name'] || ''}
            className='popup-input'
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder="Filter by cityName"
          /> 
          <XMarkIcon className='icon' onClick={togglePopupFilter}/>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>
              <div className='column-heading'>
                <div>City Name</div>
                <div className='icons-container'>
                  <ArrowDownUp
                    className='arrow-downUp'
                    onClick={() => handleSort('name')}
                  />
                  <Filter
                    className='filter-icon'
                    onClick={togglePopupFilter}
                  />
                </div>
              </div>
            </th>
            <th onClick={() => handleSort('cou_name_en')}>
              <div className='column-heading'>
                <div>Country</div>
                <div className='icons-container'>
                  <ArrowDownUp
                    className='arrow-downUp'
                    onClick={() => handleSort('cou_name_en')}
                  />
                </div>
              </div>
            </th>
            <th onClick={() => handleSort('timezone')}>
              <div className='column-heading'>
                <div>Timezone</div>
                <div className='icons-container'>
                  <ArrowDownUp
                    className='arrow-downUp'
                    onClick={() => handleSort('timezone')}
                  />
                </div>
              </div>
            </th>
            <th onClick={() => handleSort('population')}>
              <div className='column-heading'>
                <div>Population</div>
                <div className='icons-container'>
                  <ArrowDownUp
                    className='arrow-downUp'
                    onClick={() => handleSort('population')}
                  /> 
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.length > 0 ? (
            filteredCities.map((city: City, index: number) => {
              const isLastCity = index === filteredCities.length - 1;
              return (
                <tr
                  key={`${city.name}-${index}`}
                  ref={isLastCity ? lastCityRef : null} // Attach ref to last city for infinite scroll
                  onClick={(e) => handleCityClick(city.name, e)} // Navigate to city weather page on left-click
                >
                  <td>
                    <a href={`/weather/${city.name}`}>
                      {city.name}
                    </a>
                  </td>
                  <td>{city.cou_name_en}</td>
                  <td>{city.timezone}</td>
                  <td>{city.population}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="no-data">No cities available</td>
            </tr>
          )}
        </tbody>
      </table>
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};
