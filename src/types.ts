export type LatLng = {
  latitude: number;
  longitude: number;
};

export type Location = {
  latLng: LatLng;
  heading?: number;
};

export enum TravelMode {
  /**
   * No travel mode specified. Defaults to DRIVE.
   */
  TRAVEL_MODE_UNSPECIFIED = 'TRAVEL_MODE_UNSPECIFIED',

  /**
   * Travel by passenger car.
   */
  DRIVE = 'DRIVE',

  /**
   * Travel by bicycle.
   */
  BICYCLE = 'BICYCLE',

  /**
   * Travel by walking.
   */
  WALK = 'WALK',

  /**
   * Two-wheeled, motorized vehicle. For example, motorcycle.
   * Note that this differs from the BICYCLE travel mode which covers human-powered mode.
   */
  TWO_WHEELER = 'TWO_WHEELER',

  /**
   * Travel by public transit routes, where available.
   */
  TRANSIT = 'TRANSIT',
}

export enum RoutingPreference {
  /**
   * @description No routing preference specified. Defaults to TRAFFIC_UNAWARE.
   */
  ROUTING_PREFERENCE_UNSPECIFIED = 'ROUTING_PREFERENCE_UNSPECIFIED',

  /**
   * @description Computes routes without taking live traffic conditions into consideration.
   * Suitable when traffic conditions don't matter or are not applicable.
   * Using this value produces the lowest latency.
   * Note: For RouteTravelMode DRIVE and TWO_WHEELER, the route and duration
   * chosen are based on road network and average time-independent traffic
   * conditions, not current road conditions. Consequently, routes may include
   * roads that are temporarily closed. Results for a given request may vary
   * over time due to changes in the road network, updated average traffic
   * conditions, and the distributed nature of the service. Results may also
   * vary between nearly-equivalent routes at any time or frequency.
   */
  TRAFFIC_UNAWARE = 'TRAFFIC_UNAWARE',

  /**
   * @description Calculates routes taking live traffic conditions into consideration.
   * In contrast to TRAFFIC_AWARE_OPTIMAL, some optimizations are applied
   * to significantly reduce latency.
   */
  TRAFFIC_AWARE = 'TRAFFIC_AWARE',

  /**
   * @description Calculates the routes taking live traffic conditions into consideration,
   * without applying most performance optimizations. Using this value produces
   * the highest latency.
   */
  TRAFFIC_AWARE_OPTIMAL = 'TRAFFIC_AWARE_OPTIMAL',
}

export type WayPoint = {
  via?: boolean;
  vehicleStopover?: boolean;
  sideOfRoad?: boolean;
  location?: Location;
  placeId?: string;
  address?: string;
};

export type RoutModifiers = {
  /**
   * @description Whether to avoid toll roads where possible.
   * Applies to driving and two-wheeler travel modes.
   */
  avoidTolls?: boolean;

  /**
   * @description Whether to avoid highways/motorways where possible.
   * Applies to driving and two-wheeler travel modes.
   */
  avoidHighways?: boolean;

  /**
   * @description Whether to avoid ferries where possible.
   * Applies to driving and two-wheeler travel modes.
   */
  avoidFerries?: boolean;
};

export type RawRequest = {
  origin: LatLng;
  destination: LatLng;
  travelMode?: TravelMode;
  routingPreference?: RoutingPreference;
  languageCode?: string;
  routingModifiers?: RoutModifiers;
  computeAlternativeRoutes?: boolean;
  units: 'IMPERIAL' | 'METRIC';
};

export type RouteRequest = {
  origin: WayPoint;
  destination: WayPoint;
} & Omit<RawRequest, 'origin' | 'destination'>;

export interface RouteResponse {
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

export interface RouteResponseArr {
  routes: RouteResponse[];
}

export interface MapDirectionsLeg {
  distanceMeters: number;
  duration: string;
  staticDuration: string;
  polyline: Polyline;
  startLocation: Location;
  endLocation: Location;
  steps: Step[];
  localizedValues: LegLocalizedValues;
}

export interface LegLocalizedValues {
  distance: Distance;
  duration: Distance;
  staticDuration: Distance;
}

export interface Distance {
  text: string;
}

export interface Polyline {
  encodedPolyline: string;
}

export interface Step {
  distanceMeters: number;
  staticDuration: string;
  polyline: Polyline;
  startLocation: Location;
  endLocation: Location;
  navigationInstruction: NavigationInstruction;
  localizedValues: StepLocalizedValues;
  travelMode: string;
}

export interface StepLocalizedValues {
  distance: Distance;
  staticDuration: Distance;
}

export interface NavigationInstruction {
  maneuver: string;
  instructions: string;
}

export interface PolylineDetails {}

export interface Viewport {
  low: LatLng;
  high: LatLng;
}
