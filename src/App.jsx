// App.jsx
import React, { useState } from "react";
import './weatherBackgrounds.css'; // ✅ Import your background styles

import {
  Container,
  CircularProgress,
  Box,
} from "@mui/material";

import Header from "./components/Header";
import Controls from "./components/Controls";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import WeatherMap from "./components/WeatherMap";
import ExportButton from "./components/ExportButton";
import HistoricalWeather from "./components/HistoricalWeather";
import {
  getCurrentWeather,
  getForecast,
  getCurrentWeatherByCoords,
  getForecastByCoords,
  getHistoricalWeather,
} from "./api";
import { groupForecastByDay } from "./utils";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [forecastData, setForecastData] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weather = await getCurrentWeatherByCoords(latitude, longitude, unit);
            const forecast = await getForecastByCoords(latitude, longitude, unit);
            setWeatherData((prev) => [...prev, weather]);
            setForecastData((prev) => ({
              ...prev,
              [weather.name]: groupForecastByDay(forecast.list),
            }));
          } catch (err) {
            setError("Could not fetch weather for your location.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Geolocation permission denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleAddCity = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setLoading(true);
    setError("");
    try {
      const weather = await getCurrentWeather(trimmedCity, unit);
      const forecast = await getForecast(trimmedCity, unit);
      setWeatherData((prev) => [...prev, weather]);
      setForecastData((prev) => ({
        ...prev,
        [weather.name]: groupForecastByDay(forecast.list),
      }));
      setCity("");
    } catch (err) {
      setError(`City "${trimmedCity}" not found`);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = (cityName) => {
    if (!favorites.includes(cityName)) {
      setFavorites([...favorites, cityName]);
    }
  };

  const toggleUnit = async () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    setLoading(true);
    try {
      const updatedWeatherData = await Promise.all(
        weatherData.map(async (weather) => {
          const updatedWeather = await getCurrentWeather(weather.name, newUnit);
          const updatedForecast = await getForecast(weather.name, newUnit);
          return { weather: updatedWeather, forecast: updatedForecast };
        })
      );

      setWeatherData(updatedWeatherData.map((item) => item.weather));
      const newForecastData = {};
      updatedWeatherData.forEach((item) => {
        newForecastData[item.weather.name] = groupForecastByDay(item.forecast.list);
      });
      setForecastData(newForecastData);
    } catch (err) {
      setError("Error updating data after unit change.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="app" sx={{ minHeight: "100vh", p: 2 }}>
      <Container>
        <Header
          city={city}
          setCity={setCity}
          handleAddCity={handleAddCity}
          handleGetCurrentLocation={handleGetCurrentLocation}
        />
        <Controls
          unit={unit}
          toggleUnit={toggleUnit}
          favorites={favorites}
          setCity={setCity}
        />

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {weatherData.map((weather, idx) => {
          const condition = weather.weather[0].main.toLowerCase();
          const elementId = `weather-card-${idx}`;
          return (
            <Box
              key={idx}
              id={elementId}
              className={`weather-bg ${condition}`}
              sx={{ p: 2, mb: 4, borderRadius: 2 }}
            >
              <WeatherCard
                weather={weather}
                unit={unit}
                onFavorite={() => handleFavorite(weather.name)}
              />
              <ForecastCard forecast={forecastData[weather.name]} unit={unit} />
              <WeatherMap lat={weather.coord.lat} lon={weather.coord.lon} />
              <HistoricalWeather lat={weather.coord.lat} lon={weather.coord.lon} unit={unit} />
              <ExportButton elementId={elementId} fileName={`${weather.name}-weather-report.pdf`} />
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}

