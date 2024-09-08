import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { WeatherData } from '../types/city';
import './index.css';

const apiKey = import.meta.env.VITE_API_KEY;


const CityWeather: React.FC = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=${unit}&appid=${apiKey}`;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(weatherApiUrl);
        setWeatherData({
          current: {
            temp: response.data.list[0].main.temp,
            weather: response.data.list[0].weather,
            humidity: response.data.list[0].main.humidity,
            wind_speed: response.data.list[0].wind.speed,
            pressure: response.data.list[0].main.pressure,
          },
          forecast: response.data.list.slice(1, 6), // Get 5-day forecast
        });
        setError(null);
      } catch (err) {
      console.log(err);
        setError('Error fetching weather data');
      }
    };
    fetchWeather();
  }, [name, unit, weatherApiUrl]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const addToFavorites = () => {
    const updatedFavorites = [...favorites, name!];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>Weather in {name}</h2>
          {weatherData && (
            <div>
              <div>
                <h3>Current Weather</h3>
                <p>Temperature: {weatherData.current.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
                <p>Condition: {weatherData.current.weather[0].description}</p>
                <p>Humidity: {weatherData.current.humidity}%</p>
                <p>Wind Speed: {weatherData.current.wind_speed} m/s</p>
                <p>Pressure: {weatherData.current.pressure} hPa</p>
              </div>
              <div>
                <h3>5-day Forecast</h3>
                {weatherData.forecast.map((day, index) => (
                  <div key={index}>
                    <p>{day.dt_txt}</p>
                    <p>Min: {day.main.temp_min}°</p>
                    <p>Max: {day.main.temp_max}°</p>
                    <p>Condition: {day.weather[0].description}</p>
                  </div>
                ))}
              </div>
              <button onClick={toggleUnit}>
                Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
              </button>
              <button onClick={addToFavorites}>Add to Favorites</button>
            </div>
          )}
        </>
      )}
      <button onClick={()=>navigate("/")}>Go to Table Page</button>
      <button onClick={()=>navigate("/favorites")}>My Favorites</button>
    </div>
  );
};

export default CityWeather;
