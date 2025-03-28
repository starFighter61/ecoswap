/**
 * Calculate distance between two points using the Haversine formula
 * @param {Array} coords1 - [longitude, latitude] of first point
 * @param {Array} coords2 - [longitude, latitude] of second point
 * @returns {Number} Distance in kilometers
 */
const calculateDistance = (coords1, coords2) => {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert latitude and longitude from degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  // Haversine formula
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {Number} degrees - Angle in degrees
 * @returns {Number} Angle in radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Create a MongoDB geospatial query for finding items within a radius
 * @param {Array} coordinates - [longitude, latitude] of center point
 * @param {Number} radiusKm - Radius in kilometers
 * @returns {Object} MongoDB geospatial query
 */
const createGeoQuery = (coordinates, radiusKm) => {
  return {
    location: {
      $geoWithin: {
        $centerSphere: [
          coordinates,
          radiusKm / 6371 // Convert km to radians (Earth's radius is 6371 km)
        ]
      }
    }
  };
};

/**
 * Format coordinates for display
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {String} Formatted coordinates string
 */
const formatCoordinates = (coordinates) => {
  const [longitude, latitude] = coordinates;
  
  // Format latitude (N/S)
  const latDirection = latitude >= 0 ? 'N' : 'S';
  const latDegrees = Math.abs(latitude).toFixed(4);
  
  // Format longitude (E/W)
  const lonDirection = longitude >= 0 ? 'E' : 'W';
  const lonDegrees = Math.abs(longitude).toFixed(4);
  
  return `${latDegrees}° ${latDirection}, ${lonDegrees}° ${lonDirection}`;
};

module.exports = {
  calculateDistance,
  toRadians,
  createGeoQuery,
  formatCoordinates
};