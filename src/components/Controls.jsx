import React from 'react';
import { Typography, Switch, Box, Button } from '@mui/material';

const Controls = ({ unit, toggleUnit, favorites, setCity }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="body1">°C</Typography>
        <Switch onChange={toggleUnit} checked={unit === 'imperial'} />
        <Typography variant="body1">°F</Typography>
      </Box>

      {favorites.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">⭐ Favorite Cities</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {favorites.map((fav) => (
              <Button key={fav} onClick={() => setCity(fav)} variant="outlined">
                {fav}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Controls;
