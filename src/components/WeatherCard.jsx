import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

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

const WeatherCard = ({ weather, unit, onFavorite }) => {
  const { name, weather: details, main, wind } = weather;
  const { main: condition, description } = details[0];
  const temperature = Math.round(main.temp);
  const tempSymbol = unit === 'metric' ? '°C' : '°F';
  const emoji = getEmoji(condition);

  return (
    <Card elevation={4} sx={{ mb: 2, p: 2, position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">{name}</Typography>
          <IconButton onClick={onFavorite} color="error">
            <FavoriteIcon />
          </IconButton>
        </Box>

        <Typography variant="h2">
          {temperature}{tempSymbol} {emoji}
        </Typography>
        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
          {description}
        </Typography>

        <Typography variant="body1">💧 Humidity: {main.humidity}%</Typography>
        <Typography variant="body1">💨 Wind: {wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;