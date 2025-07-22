import axios from 'axios';

const API_KEY = 'YOUR_WEATHERBIT_API_KEY'; // Replace with your Weatherbit API key
const BASE_URL = 'https://api.weatherbit.io/v2.0';

export const getCurrentWeather = async (city, unit = 'M') => {
  try {
    const res = await axios.get(`${BASE_URL}/current`, {
      params: {
        city: city,
        key: API_KEY,
        units: unit,
      },
    });
    return res.data.data[0];
  } catch (error) {
    console.error('Weatherbit API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getForecast = async (city, unit = 'M') => {
  try {
    const res = await axios.get(`${BASE_URL}/forecast/daily`, {
      params: {
        city: city,
        key: API_KEY,
        units: unit,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Weatherbit Forecast API Error:', error.response?.data || error.message);
    throw error;
  }
};
