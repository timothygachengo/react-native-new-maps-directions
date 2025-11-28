import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { MapViewDirections } from 'react-native-new-maps-directions';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <MapViewDirections
          origin={{ latitude: 0, longitude: 0 }}
          destination={{ latitude: 0, longitude: 0 }}
          apikey="YOUR_API_KEY"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
  },
});
