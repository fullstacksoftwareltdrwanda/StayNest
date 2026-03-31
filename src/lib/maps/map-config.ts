// Map configuration and constants
export const MAP_CONFIG = {
  // CartoDB Positron - A clean, modern, grayscale tile layer
  TILE_LAYER: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  DEFAULT_CENTER: [-1.9441, 30.0619] as [number, number], // Kigali, Rwanda
  DEFAULT_ZOOM: 13,
  PROPERTY_ZOOM: 15,
}

// Custom map styles (optional, but Leaflet usually handles this via CSS)
export const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  zIndex: 0, // Ensure it doesn't overlap higher elements like headers
}
