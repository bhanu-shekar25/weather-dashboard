// src/api.js
import axios from 'axios';
import * as weatherbit from './weatherbit';

const API_KEY = '389db9aae6931b648a4961eee8bcaaf8'; // Replace with your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (city, unit = 'metric') => {
  try {
    const res = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: unit,
      },
    });
    return res.data;
  } catch (error) {
    console.error('OpenWeatherMap API Error:', error.response?.data || error.message);
    console.log('Falling back to Weatherbit API');
    const weatherbitUnit = unit === 'metric' ? 'M' : 'I';
    return weatherbit.getCurrentWeather(city, weatherbitUnit);
  }
};

export const getForecast = async (city, unit = 'metric') => {
  try {
    const res = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: unit,
      },
    });
    return res.data;
  } catch (error) {
    console.error('OpenWeatherMap Forecast API Error:', error.response?.data || error.message);
    console.log('Falling back to Weatherbit API');
    const weatherbitUnit = unit === 'metric' ? 'M' : 'I';
    return weatherbit.getForecast(city, weatherbitUnit);
  }
};

export const getCurrentWeatherByCoords = async (lat, lon, unit) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
  );
  return res.data;
};

export const getHistoricalWeather = async (lat, lon, unit) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
  );
  return res.data;
};

export const getForecastByCoords = async (lat, lon, unit) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
  );
  return res.data;
};

