import { getPreciseDistance } from 'geolib';

export const calculateDistances = (userLocation, locations) => {
  const distances = locations.map(location => {
    const distance = getPreciseDistance(userLocation, location);
    return { ...location, distance };
  });

  // Sort the locations by distance
  distances.sort((a, b) => a.distance - b.distance);

  return distances;
};