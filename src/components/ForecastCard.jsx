// src/components/ForecastCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const getEmoji = (main) => {
  const map = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Drizzle: '🌦️',
  };
  return map[main] || '🌈';
};

const ForecastCard = ({ forecast, unit }) => {
  if (!forecast || typeof forecast !== 'object') return null;

  const tempSymbol = unit === 'metric' ? '°C' : '°F';
  const dailyForecasts = Object.values(forecast).slice(0, 5); // Limit to 5 days

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>📅 5-Day Forecast</Typography>
      <Grid container spacing={2}>
        {dailyForecasts.map((day, index) => {
          const date = new Date(day.dt_txt).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          const weather = day.weather?.[0];
          const condition = weather?.main || 'Unknown';
          const description = weather?.description || 'No data';
          const emoji = getEmoji(condition);
          const temperature = Math.round(day.main?.temp ?? 0);

          return (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Card sx={{ textAlign: 'center', p: 1 }}>
                <CardContent>
                  <Typography variant="body2">{date}</Typography>
                  <Typography variant="h5">{emoji}</Typography>
                  <Typography variant="body1">
                    {temperature}{tempSymbol}
                  </Typography>
                  <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                    {description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ForecastCard;
