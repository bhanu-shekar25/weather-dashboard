// src/App.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Switch,
  CircularProgress,
  Box,
} from "@mui/material";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import { getCurrentWeather, getForecast,getCurrentWeatherByCoords,
  getForecastByCoords } from "./api";
import { groupForecastByDay } from "./utils";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [forecastData, setForecastData] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState("metric"); // 'imperial' = F
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weather = await getCurrentWeatherByCoords(
            latitude,
            longitude,
            unit
          );
          const forecast = await getForecastByCoords(latitude, longitude, unit);

          setWeatherData((prev) => [...prev, weather]);
          setForecastData((prev) => ({
            ...prev,
            [weather.name]: groupForecastByDay(forecast.list),
          }));
        } catch (err) {
          setError("Failed to fetch weather for current location");
        } finally {
          setLoading(false);
        }
        console.log("Location:", latitude, longitude);

      },
      (error) => {
        setError("Location permission denied or unavailable");
        setLoading(false);
      }
    );
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

    // Refetch weather and forecast data for all current cities
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
        newForecastData[item.weather.name] = groupForecastByDay(
          item.forecast.list
        );
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
        <Typography variant="h4" gutterBottom>
          🌦 Weather Dashboard
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Enter City"
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleGetCurrentLocation}>
            Use Current Location
          </Button>

          <Button variant="contained" onClick={handleAddCity}>
            Search
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="body1">°C</Typography>
          <Switch onChange={toggleUnit} checked={unit === "imperial"} />
          <Typography variant="body1">°F</Typography>
        </Box>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {favorites.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">⭐ Favorite Cities</Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {favorites.map((fav) => (
                <Button
                  key={fav}
                  onClick={() => setCity(fav)}
                  variant="outlined"
                >
                  {fav}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {weatherData.map((weather, idx) => (
          <Box
            key={idx}
            className={`weather-bg ${weather.weather[0].main.toLowerCase()}`}
            sx={{ p: 2, mb: 4, borderRadius: 2 }}
          >
            <WeatherCard
              weather={weather}
              unit={unit}
              onFavorite={() => handleFavorite(weather.name)}
            />
            <ForecastCard forecast={forecastData[weather.name]} unit={unit} />
          </Box>
        ))}
      </Container>
    </Box>
  );
}
