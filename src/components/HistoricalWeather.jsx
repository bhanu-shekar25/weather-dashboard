import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { getHistoricalWeather } from '../api';

const HistoricalWeather = ({ lat, lon, unit }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        const data = await getHistoricalWeather(lat, lon, unit);
        setHistoricalData(data);
      } catch (err) {
        setError('Failed to fetch historical data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [lat, lon, unit]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Card elevation={4} sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Historical Weather Data (Last 5 Days)
        </Typography>
        {historicalData && (
          <ul>
            {historicalData.list.slice(0, 5).map((item, index) => (
              <li key={index}>
                {new Date(item.dt * 1000).toLocaleDateString()}: {item.main.temp}°
                {unit === 'metric' ? 'C' : 'F'}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalWeather;
