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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setSuccessMessage(`"${name}" has been added to favorites!`);
    setTimeout(() => setSuccessMessage(null), 3000); // Hide message after 3 seconds
  };

  const getWeatherColor = (description: string) => {
    if (description.includes('clear')) return '#f7d779'; // Clear
    if (description.includes('cloud')) return '#b0bec5'; // Cloudy
    if (description.includes('rain')) return '#4fc3f7'; // Rainy
    if (description.includes('snow')) return '#ffffff'; // Snowy
    if (description.includes('storm')) return '#b71c1c'; // Stormy
    return '#90a4ae'; // Default
  };

  return (
    <div className="weather-container">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h2 className="city-name">Weather in {name}</h2>
          {weatherData && (
            <div className="weather-info">
              <div className="current-weather" style={{ backgroundColor: getWeatherColor(weatherData.current.weather[0].description) }}>
                <h3>Current Weather</h3>
                <p>Temperature: {weatherData.current.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
                <p>Condition: {weatherData.current.weather[0].description}</p>
                <p>Humidity: {weatherData.current.humidity}%</p>
                <p>Wind Speed: {weatherData.current.wind_speed} m/s</p>
                <p>Pressure: {weatherData.current.pressure} hPa</p>
              </div>
              <div className="forecast">
                <h3>5-day Forecast</h3>
                {weatherData.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="forecast-day"
                    style={{ backgroundColor: getWeatherColor(day.weather[0].description) }}
                  >
                    <p>{day.dt_txt}</p>
                    <p>Min: {day.main.temp_min}°</p>
                    <p>Max: {day.main.temp_max}°</p>
                    <p>Condition: {day.weather[0].description}</p>
                  </div>
                ))}
              </div>
              <button onClick={toggleUnit} className="toggle-unit-btn">
                Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
              </button>
              <button onClick={addToFavorites} className="favorites-btn">Add to Favorites</button>
              {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
          )}
        </>
      )}
      <div className="navigation-buttons">
        <button onClick={() => navigate("/")} className="nav-btn">Go to Table Page</button>
        <button onClick={() => navigate("/favorites")} className="nav-btn">My Favorites</button>
      </div>
    </div>
  );
};

export default CityWeather;
