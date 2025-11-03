import { View, StyleSheet } from 'react-native';
import { MapViewDirections } from 'react-native-new-maps-directions';

export default function App() {
  return (
    <View style={styles.container}>
      <MapViewDirections
        origin={{ latitude: 0, longitude: 0 }}
        destination={{ latitude: 0, longitude: 0 }}
        apikey="YOUR_API_KEY"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
