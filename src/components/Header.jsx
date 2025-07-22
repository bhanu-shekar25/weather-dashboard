import React from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';

const Header = ({ city, setCity, handleAddCity, handleGetCurrentLocation }) => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        🌦 Weather Dashboard
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
    </>
  );
};

export default Header;
