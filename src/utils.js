// src/utils/index.js
export const groupForecastByDay = (list) => {
  const grouped = {};

  list.forEach((item) => {
    const date = item.dt_txt?.split(' ')[0]; // e.g., "2025-06-18"
    if (!grouped[date] && item.weather && item.main && item.dt_txt) {
      grouped[date] = item; // first available entry for that day
    }
  });

  return grouped;
};
