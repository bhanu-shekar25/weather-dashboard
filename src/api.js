// src/api.js
import axios from 'axios';

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
    console.error('Weather API Error:', error.response?.data || error.message);
    throw error;
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
    console.error('Forecast API Error:', error.response?.data || error.message);
    throw error;
  }
};
