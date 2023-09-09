import { useEffect, useState } from 'react';
import { Button, Linking, FlatList, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { calculateDistances } from './distance_calculator';
import { importantLocations } from './important_locations';

const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return null;
  }

  let location = await Location.getCurrentPositionAsync({});
  return location.coords;
};

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [closestLocations, setClosestLocations] = useState([]);

  useEffect(() => {
    getLocation()
      .then(coords => setUserLocation(coords))
      .catch(error => console.error(error));
  }, []);
  useEffect(() => {
    if (userLocation) {
      const sortedLocations = calculateDistances(userLocation, importantLocations);
      const top10ClosestLocations = sortedLocations.slice(0, 10);
      setClosestLocations(top10ClosestLocations);
    }
  }, [userLocation]);
  function extrenal_Link(item) {
    const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${item.latitude},${item.longitude}`;
    Linking.openURL(url)
  }
  

  return (
    <>
    <View style={{paddingTop: 200}}>
      <Text>Latitude: {userLocation ? userLocation.latitude : 'Loading...'}</Text>
      <Text>Longitude: {userLocation ? userLocation.longitude : 'Loading...'}</Text>
    </View>
    <View>
      {/* <Button title="Find Closest Locations" onPress={handleFindClosestLocations} /> */}
        <FlatList
          data={closestLocations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style ={{ display: 'flex', flexDirection: 'row'}}>
              <View style ={{ display: 'flex', flexDirection: 'column', flex: 5}}>
                <Text>Name: {item.name}</Text>
                <Text>Distance: {item.distance} meters</Text>
              </View>
              <View style ={{ display: 'flex', justifyContent: 'center', flex: 1}}><Button title='external link' onPress={()=>{extrenal_Link(item)}} /></View>
            </View>
          )}
        />
      </View>
    </>
  );
}
