# react-native-new-maps-directions

A TypeScript port of [react-native-maps-directions](https://www.npmjs.com/package/react-native-maps-directions) that provides a React Native component for rendering directions on maps using Google Maps Routes API.

## Features

- 🗺️ Render directions as polylines on React Native Maps
- 🚗 Support for multiple travel modes (driving, walking, cycling, transit, two-wheeler)
- 📍 Full TypeScript support with type definitions
- 🔄 Automatic route fetching and rendering
- ⚡ Built-in polyline decoding
- 🎯 Callback support for route events (onReady, onError, onStart)

## Installation

NPM

```sh
npm install react-native-new-maps-directions
```

or

Yarn

```sh
yarn add react-native-new-maps-directions
```

or

Bun

```sh
bun add react-native-new-maps-directions
```

## Prerequisites

This package requires:

- `react-native-maps` - Make sure you have it installed and properly configured
- A Google Maps API Key with Routes API enabled

**Note:** This package does not work with Expo Go due to native dependencies. You'll need to use a development build or eject from Expo managed workflow.

### Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Routes API** (formerly Directions API)
4. Create credentials (API Key)
5. Restrict your API key for security (recommended)

## Basic Usage

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { MapViewDirections } from 'react-native-new-maps-directions';

export default function App() {
  const origin = { latitude: 37.78825, longitude: -122.4324 };
  const destination = { latitude: 37.7749, longitude: -122.4194 };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey="YOUR_GOOGLE_MAPS_API_KEY"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
```

## API Reference

### MapViewDirections Props

The `MapViewDirections` component accepts all props from `MapPolyline` (from `react-native-maps`) plus the following:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `origin` | `LatLng` | Yes | - | Starting point coordinates `{ latitude: number, longitude: number }` |
| `destination` | `LatLng` | Yes | - | Destination point coordinates `{ latitude: number, longitude: number }` |
| `apikey` | `string` | Yes | - | Your Google Maps API Key |
| `travelMode` | `TravelMode` | No | `TRAVEL_MODE_UNSPECIFIED` | Travel mode (see Travel Modes below) |
| `languageCode` | `string` | No | `'en-US'` | Language code for route instructions |
| `resetOnChange` | `boolean` | No | `false` | Reset route when origin/destination changes |
| `onReady` | `(result: MapDirectionsResponse) => void` | No | - | Callback when route is successfully fetched |
| `onError` | `(error: any) => void` | No | - | Callback when route fetching fails |
| `onStart` | `(args: any) => void` | No | - | Callback when route fetching starts |
| `coordinates` | `LatLng[]` | No | - | Manual coordinates override (if provided, route fetching is skipped) |

### Travel Modes

The `travelMode` prop accepts the following values from the `TravelMode` enum:

- `TravelMode.DRIVE` - Travel by passenger car
- `TravelMode.WALK` - Travel by walking
- `TravelMode.BICYCLE` - Travel by bicycle
- `TravelMode.TRANSIT` - Travel by public transit routes
- `TravelMode.TWO_WHEELER` - Two-wheeled, motorized vehicle (e.g., motorcycle)
- `TravelMode.TRAVEL_MODE_UNSPECIFIED` - No travel mode specified (defaults to DRIVE)

## Examples

### Basic Route with Callbacks

```tsx
import { MapViewDirections, TravelMode, type MapDirectionsResponse } from 'react-native-new-maps-directions';

<MapViewDirections
  origin={{ latitude: 37.78825, longitude: -122.4324 }}
  destination={{ latitude: 37.7749, longitude: -122.4194 }}
  apikey="YOUR_API_KEY"
  travelMode={TravelMode.DRIVE}
  onReady={(result: MapDirectionsResponse) => {
    console.log(`Distance: ${result.distanceMeters} meters`);
    console.log(`Duration: ${result.duration}`);
  }}
  onError={(error) => {
    console.error('Error fetching route:', error);
  }}
/>
```

### Walking Directions

```tsx
<MapViewDirections
  origin={{ latitude: 37.78825, longitude: -122.4324 }}
  destination={{ latitude: 37.7749, longitude: -122.4194 }}
  apikey="YOUR_API_KEY"
  travelMode={TravelMode.WALK}
/>
```

### Custom Polyline Styling

Since `MapViewDirections` extends `MapPolyline`, you can use all polyline styling props:

```tsx
<MapViewDirections
  origin={{ latitude: 37.78825, longitude: -122.4324 }}
  destination={{ latitude: 37.7749, longitude: -122.4194 }}
  apikey="YOUR_API_KEY"
  strokeColor="#0000FF"
  strokeWidth={3}
  lineDashPattern={[1]}
/>
```

### Dynamic Origin/Destination

```tsx
import { useState } from 'react';

function MapWithDirections() {
  const [origin, setOrigin] = useState({ latitude: 37.78825, longitude: -122.4324 });
  const [destination, setDestination] = useState({ latitude: 37.7749, longitude: -122.4194 });

  return (
    <MapView>
      <MapViewDirections
        origin={origin}
        destination={destination}
        apikey="YOUR_API_KEY"
        resetOnChange={true}
      />
    </MapView>
  );
}
```

### Handling Route Data

```tsx
<MapViewDirections
  origin={origin}
  destination={destination}
  apikey="YOUR_API_KEY"
  onReady={(result) => {
    // Access route information
    const distance = result.distanceMeters;
    const duration = result.duration;
    const legs = result.legs;

    // Access polyline
    const encodedPolyline = result.polyline.encodedPolyline;

    // Access viewport for fitting map bounds
    const viewport = result.viewport;
  }}
/>
```

## TypeScript Support

This package is written in TypeScript and includes full type definitions. You can import types as needed:

```tsx
import type {
  MapDirectionsResponse,
  MapDirectionsLeg,
  LatLng,
  TravelMode,
  RoutingPreference,
  Location,
  WayPoint,
  RoutModifiers,
  Polyline,
  Viewport,
  Step,
  NavigationInstruction,
  LegLocalizedValues,
  StepLocalizedValues,
  Distance,
} from 'react-native-new-maps-directions';
```

## Types Reference

### Core Types

#### `LatLng`

Represents a geographic coordinate with latitude and longitude.

```typescript
type LatLng = {
  latitude: number;
  longitude: number;
};
```

#### `Location`

Represents a location with optional heading information.

```typescript
type Location = {
  latLng: LatLng;
  heading?: number;
};
```

### Enums

#### `TravelMode`

Enum for specifying the travel mode for route calculation.

```typescript
enum TravelMode {
  TRAVEL_MODE_UNSPECIFIED = 'TRAVEL_MODE_UNSPECIFIED', // Defaults to DRIVE
  DRIVE = 'DRIVE',                                      // Travel by passenger car
  WALK = 'WALK',                                        // Travel by walking
  BICYCLE = 'BICYCLE',                                  // Travel by bicycle
  TWO_WHEELER = 'TWO_WHEELER',                         // Two-wheeled motorized vehicle (e.g., motorcycle)
  TRANSIT = 'TRANSIT',                                  // Travel by public transit routes
}
```

#### `RoutingPreference`

Enum for specifying routing preferences, particularly for traffic awareness.

```typescript
enum RoutingPreference {
  ROUTING_PREFERENCE_UNSPECIFIED = 'ROUTING_PREFERENCE_UNSPECIFIED', // Defaults to TRAFFIC_UNAWARE
  TRAFFIC_UNAWARE = 'TRAFFIC_UNAWARE',                               // No live traffic consideration (lowest latency)
  TRAFFIC_AWARE = 'TRAFFIC_AWARE',                                   // Live traffic with optimizations
  TRAFFIC_AWARE_OPTIMAL = 'TRAFFIC_AWARE_OPTIMAL',                   // Live traffic without optimizations (highest latency)
}
```

### Route Types

#### `MapDirectionsResponse`

The main response object returned by the `onReady` callback.

```typescript
interface MapDirectionsResponse {
  legs: MapDirectionsLeg[];
  distanceMeters: number;
  duration: string;
  staticDuration: string;
  polyline: Polyline;
  description: string;
  warnings: string[];
  viewport: Viewport;
  travelAdvisory: PolylineDetails;
  localizedValues: LegLocalizedValues;
  routeLabels: string[];
  polylineDetails: PolylineDetails;
}
```

#### `MapDirectionsLeg`

Represents a single leg of a route (portion between two waypoints).

```typescript
interface MapDirectionsLeg {
  distanceMeters: number;
  duration: string;
  staticDuration: string;
  polyline: Polyline;
  startLocation: Location;
  endLocation: Location;
  steps: Step[];
  localizedValues: LegLocalizedValues;
}
```

#### `Step`

Represents a single step/instruction in a route leg.

```typescript
interface Step {
  distanceMeters: number;
  staticDuration: string;
  polyline: Polyline;
  startLocation: Location;
  endLocation: Location;
  navigationInstruction: NavigationInstruction;
  localizedValues: StepLocalizedValues;
  travelMode: string;
}
```

#### `NavigationInstruction`

Contains navigation instructions for a step.

```typescript
interface NavigationInstruction {
  maneuver: string;
  instructions: string;
}
```

### Supporting Types

#### `Polyline`

Encoded polyline string for rendering the route.

```typescript
interface Polyline {
  encodedPolyline: string;
}
```

#### `Viewport`

Bounding box for the route.

```typescript
interface Viewport {
  low: LatLng;
  high: LatLng;
}
```

#### `LegLocalizedValues`

Localized distance and duration values for a leg.

```typescript
interface LegLocalizedValues {
  distance: Distance;
  duration: Distance;
  staticDuration: Distance;
}
```

#### `StepLocalizedValues`

Localized distance and duration values for a step.

```typescript
interface StepLocalizedValues {
  distance: Distance;
  staticDuration: Distance;
}
```

#### `Distance`

Localized distance representation.

```typescript
interface Distance {
  text: string;
}
```

### Advanced Types

#### `WayPoint`

Represents a waypoint in a route (for future use with waypoints support).

```typescript
type WayPoint = {
  via?: boolean;
  vehicleStopover?: boolean;
  sideOfRoad?: boolean;
  location?: Location;
  placeId?: string;
  address?: string;
};
```

#### `RoutModifiers`

Route modifiers for avoiding certain road types.

```typescript
type RoutModifiers = {
  avoidTolls?: boolean;      // Avoid toll roads (applies to DRIVE and TWO_WHEELER)
  avoidHighways?: boolean;   // Avoid highways/motorways (applies to DRIVE and TWO_WHEELER)
  avoidFerries?: boolean;    // Avoid ferries (applies to DRIVE and TWO_WHEELER)
};
```

## Response Object Structure

The `onReady` callback receives a `MapDirectionsResponse` object with the following structure:

```typescript
interface MapDirectionsResponse {
  legs: MapDirectionsLeg[];
  distanceMeters: number;
  duration: string;
  staticDuration: string;
  polyline: {
    encodedPolyline: string;
  };
  description: string;
  warnings: string[];
  viewport: {
    low: LatLng;
    high: LatLng;
  };
  travelAdvisory: PolylineDetails;
  localizedValues: LegLocalizedValues;
  routeLabels: string[];
  polylineDetails: PolylineDetails;
}
```

## Notes

- The component automatically fetches and renders the route when `origin` and `destination` are provided
- If `coordinates` prop is provided, route fetching is skipped and the provided coordinates are used directly
- The component returns `null` until coordinates are available
- Make sure your Google Maps API Key has the Routes API enabled
- Consider implementing API key restrictions in Google Cloud Console for production use

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
