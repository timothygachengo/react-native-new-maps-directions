import {
  TravelMode,
  RoutingPreference,
  type LatLng,
  type Location,
  type WayPoint,
  type RoutModifiers,
  type RawRequest,
  type RouteRequest,
} from '../types';

describe('Types', () => {
  describe('TravelMode enum', () => {
    it('should have correct values', () => {
      expect(TravelMode.TRAVEL_MODE_UNSPECIFIED).toBe(
        'TRAVEL_MODE_UNSPECIFIED'
      );
      expect(TravelMode.DRIVE).toBe('DRIVE');
      expect(TravelMode.BICYCLE).toBe('BICYCLE');
      expect(TravelMode.WALK).toBe('WALK');
      expect(TravelMode.TWO_WHEELER).toBe('TWO_WHEELER');
      expect(TravelMode.TRANSIT).toBe('TRANSIT');
    });

    it('should have all expected travel modes', () => {
      const modes = Object.values(TravelMode);
      expect(modes).toHaveLength(6);
      expect(modes).toContain('TRAVEL_MODE_UNSPECIFIED');
      expect(modes).toContain('DRIVE');
      expect(modes).toContain('BICYCLE');
      expect(modes).toContain('WALK');
      expect(modes).toContain('TWO_WHEELER');
      expect(modes).toContain('TRANSIT');
    });
  });

  describe('RoutingPreference enum', () => {
    it('should have correct values', () => {
      expect(RoutingPreference.ROUTING_PREFERENCE_UNSPECIFIED).toBe(
        'ROUTING_PREFERENCE_UNSPECIFIED'
      );
      expect(RoutingPreference.TRAFFIC_UNAWARE).toBe('TRAFFIC_UNAWARE');
      expect(RoutingPreference.TRAFFIC_AWARE).toBe('TRAFFIC_AWARE');
      expect(RoutingPreference.TRAFFIC_AWARE_OPTIMAL).toBe(
        'TRAFFIC_AWARE_OPTIMAL'
      );
    });

    it('should have all expected routing preferences', () => {
      const preferences = Object.values(RoutingPreference);
      expect(preferences).toHaveLength(4);
      expect(preferences).toContain('ROUTING_PREFERENCE_UNSPECIFIED');
      expect(preferences).toContain('TRAFFIC_UNAWARE');
      expect(preferences).toContain('TRAFFIC_AWARE');
      expect(preferences).toContain('TRAFFIC_AWARE_OPTIMAL');
    });
  });

  describe('Type definitions', () => {
    it('should accept valid LatLng', () => {
      const latLng: LatLng = {
        latitude: 40.7128,
        longitude: -74.006,
      };

      expect(latLng.latitude).toBe(40.7128);
      expect(latLng.longitude).toBe(-74.006);
    });

    it('should accept valid Location', () => {
      const location: Location = {
        latLng: {
          latitude: 40.7128,
          longitude: -74.006,
        },
        heading: 90,
      };

      expect(location.latLng.latitude).toBe(40.7128);
      expect(location.heading).toBe(90);
    });

    it('should accept Location without heading', () => {
      const location: Location = {
        latLng: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      };

      expect(location.heading).toBeUndefined();
    });

    it('should accept valid WayPoint with location', () => {
      const waypoint: WayPoint = {
        location: {
          latLng: {
            latitude: 40.7128,
            longitude: -74.006,
          },
        },
        via: false,
        vehicleStopover: true,
      };

      expect(waypoint.location?.latLng.latitude).toBe(40.7128);
      expect(waypoint.via).toBe(false);
      expect(waypoint.vehicleStopover).toBe(true);
    });

    it('should accept WayPoint with placeId', () => {
      const waypoint: WayPoint = {
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      };

      expect(waypoint.placeId).toBe('ChIJN1t_tDeuEmsRUsoyG83frY4');
      expect(waypoint.location).toBeUndefined();
    });

    it('should accept WayPoint with address', () => {
      const waypoint: WayPoint = {
        address: '1600 Amphitheatre Parkway, Mountain View, CA',
      };

      expect(waypoint.address).toBe(
        '1600 Amphitheatre Parkway, Mountain View, CA'
      );
      expect(waypoint.location).toBeUndefined();
    });

    it('should accept valid RoutModifiers', () => {
      const modifiers: RoutModifiers = {
        avoidTolls: true,
        avoidHighways: false,
        avoidFerries: true,
      };

      expect(modifiers.avoidTolls).toBe(true);
      expect(modifiers.avoidHighways).toBe(false);
      expect(modifiers.avoidFerries).toBe(true);
    });

    it('should accept empty RoutModifiers', () => {
      const modifiers: RoutModifiers = {};

      expect(modifiers.avoidTolls).toBeUndefined();
      expect(modifiers.avoidHighways).toBeUndefined();
      expect(modifiers.avoidFerries).toBeUndefined();
    });

    it('should accept valid RawRequest', () => {
      const request: RawRequest = {
        origin: { latitude: 40.7128, longitude: -74.006 },
        destination: { latitude: 34.0522, longitude: -118.2437 },
        units: 'METRIC',
        travelMode: TravelMode.DRIVE,
        routingPreference: RoutingPreference.TRAFFIC_AWARE,
        languageCode: 'en-US',
        computeAlternativeRoutes: true,
      };

      expect(request.origin.latitude).toBe(40.7128);
      expect(request.destination.latitude).toBe(34.0522);
      expect(request.units).toBe('METRIC');
      expect(request.travelMode).toBe(TravelMode.DRIVE);
    });

    it('should accept RawRequest with IMPERIAL units', () => {
      const request: RawRequest = {
        origin: { latitude: 40.7128, longitude: -74.006 },
        destination: { latitude: 34.0522, longitude: -118.2437 },
        units: 'IMPERIAL',
      };

      expect(request.units).toBe('IMPERIAL');
    });

    it('should accept valid RouteRequest', () => {
      const request: RouteRequest = {
        origin: {
          location: {
            latLng: { latitude: 40.7128, longitude: -74.006 },
          },
        },
        destination: {
          location: {
            latLng: { latitude: 34.0522, longitude: -118.2437 },
          },
        },
        units: 'METRIC',
        travelMode: TravelMode.BICYCLE,
      };

      expect(request.origin.location?.latLng.latitude).toBe(40.7128);
      expect(request.destination.location?.latLng.latitude).toBe(34.0522);
      expect(request.travelMode).toBe(TravelMode.BICYCLE);
    });

    it('should accept RouteRequest with routing modifiers', () => {
      const request: RouteRequest = {
        origin: {
          location: {
            latLng: { latitude: 40.7128, longitude: -74.006 },
          },
        },
        destination: {
          location: {
            latLng: { latitude: 34.0522, longitude: -118.2437 },
          },
        },
        units: 'METRIC',
        routingModifiers: {
          avoidTolls: true,
          avoidHighways: true,
          avoidFerries: false,
        },
      };

      expect(request.routingModifiers?.avoidTolls).toBe(true);
      expect(request.routingModifiers?.avoidHighways).toBe(true);
      expect(request.routingModifiers?.avoidFerries).toBe(false);
    });
  });

  describe('Type validation', () => {
    it('should ensure latitude is a number', () => {
      const latLng: LatLng = {
        latitude: 40.7128,
        longitude: -74.006,
      };

      expect(typeof latLng.latitude).toBe('number');
      expect(typeof latLng.longitude).toBe('number');
    });

    it('should ensure heading is optional in Location', () => {
      const locationWithHeading: Location = {
        latLng: { latitude: 0, longitude: 0 },
        heading: 180,
      };

      const locationWithoutHeading: Location = {
        latLng: { latitude: 0, longitude: 0 },
      };

      expect(locationWithHeading.heading).toBeDefined();
      expect(locationWithoutHeading.heading).toBeUndefined();
    });

    it('should ensure WayPoint properties are optional', () => {
      const emptyWaypoint: WayPoint = {};

      expect(emptyWaypoint.via).toBeUndefined();
      expect(emptyWaypoint.location).toBeUndefined();
      expect(emptyWaypoint.placeId).toBeUndefined();
      expect(emptyWaypoint.address).toBeUndefined();
    });
  });
});
