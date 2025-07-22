import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const WeatherMap = ({ lat, lon }) => {
  const mapUrl = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${lat}&lon=${lon}&zoom=10`;

  return (
    <Card elevation={4} sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Weather Map
        </Typography>
        <Box sx={{ height: 400 }}>
          <iframe
            title="Weather Map"
            width="100%"
            height="100%"
            frameBorder="0"
            src={mapUrl}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherMap;
