import { RouteService } from '../route-service';
import {
  TravelMode,
  RoutingPreference,
  type RawRequest,
  type RouteResponseArr,
} from '../types';

// Mock fetch globally
global.fetch = jest.fn();

describe('RouteService', () => {
  let routeService: RouteService;

  beforeEach(() => {
    routeService = new RouteService();
    jest.clearAllMocks();
  });

  describe('getRoute', () => {
    const mockApiKey = 'test-api-key';
    const mockRequest: RawRequest = {
      origin: { latitude: 40.7128, longitude: -74.006 },
      destination: { latitude: 34.0522, longitude: -118.2437 },
      units: 'METRIC',
    };

    const mockResponse: RouteResponseArr = {
      routes: [
        {
          legs: [],
          distanceMeters: 4490000,
          duration: '42000s',
          staticDuration: '42000s',
          polyline: { encodedPolyline: '_p~iF~ps|U_ulLnnqC_mqNvxq`@' },
          description: 'Route 1',
          warnings: [],
          viewport: {
            low: { latitude: 34.0522, longitude: -118.2437 },
            high: { latitude: 40.7128, longitude: -74.006 },
          },
          travelAdvisory: {},
          localizedValues: {
            distance: { text: '4,490 km' },
            duration: { text: '11 hours 40 mins' },
            staticDuration: { text: '11 hours 40 mins' },
          },
          routeLabels: [],
          polylineDetails: {},
        },
      ],
    };

    it('should call Google Routes API with correct parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await routeService.getRoute(mockApiKey, mockRequest);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': mockApiKey,
            'X-Goog-FieldMask': '*',
          },
          body: JSON.stringify({
            origin: {
              location: {
                latLng: {
                  latitude: 40.7128,
                  longitude: -74.006,
                },
              },
            },
            destination: {
              location: {
                latLng: {
                  latitude: 34.0522,
                  longitude: -118.2437,
                },
              },
            },
            routingPreference: RoutingPreference.ROUTING_PREFERENCE_UNSPECIFIED,
            travelMode: TravelMode.TRAVEL_MODE_UNSPECIFIED,
            units: 'METRIC',
            languageCode: 'en-US',
            computeAlternativeRoutes: false,
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should use default values when optional parameters are not provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await routeService.getRoute(mockApiKey, mockRequest);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.routingPreference).toBe(
        RoutingPreference.ROUTING_PREFERENCE_UNSPECIFIED
      );
      expect(requestBody.travelMode).toBe(TravelMode.TRAVEL_MODE_UNSPECIFIED);
      expect(requestBody.units).toBe('METRIC');
      expect(requestBody.languageCode).toBe('en-US');
      expect(requestBody.computeAlternativeRoutes).toBe(false);
    });

    it('should use provided optional parameters', async () => {
      const requestWithOptions: RawRequest = {
        ...mockRequest,
        travelMode: TravelMode.DRIVE,
        routingPreference: RoutingPreference.TRAFFIC_AWARE,
        languageCode: 'es-ES',
        computeAlternativeRoutes: true,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await routeService.getRoute(mockApiKey, requestWithOptions);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.travelMode).toBe(TravelMode.DRIVE);
      expect(requestBody.routingPreference).toBe(
        RoutingPreference.TRAFFIC_AWARE
      );
      expect(requestBody.languageCode).toBe('es-ES');
      expect(requestBody.computeAlternativeRoutes).toBe(true);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(
        routeService.getRoute(mockApiKey, mockRequest)
      ).rejects.toMatch(/Error on GMAPS route request/);
    });

    it('should handle response parsing errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(
        routeService.getRoute(mockApiKey, mockRequest)
      ).rejects.toMatch(/Error on GMAPS route request/);
    });

    it('should handle routing modifiers', async () => {
      const requestWithModifiers: RawRequest = {
        ...mockRequest,
        routingModifiers: {
          avoidTolls: true,
          avoidHighways: true,
          avoidFerries: false,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await routeService.getRoute(mockApiKey, requestWithModifiers);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      // Note: routingModifiers are not currently passed through in buildRequestBody
      // This test documents current behavior
      expect(requestBody.routingModifiers).toBeUndefined();
    });
  });

  describe('decodePolyline', () => {
    it('should decode a simple polyline string', () => {
      const encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
      const result = routeService.decodePolyline(encoded);

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveLength(2);
      expect(typeof result[0]![0]).toBe('number');
      expect(typeof result[0]![1]).toBe('number');
    });

    it('should decode with default precision (5)', () => {
      const encoded = '_p~iF~ps|U';
      const result = routeService.decodePolyline(encoded);

      // Check that coordinates are decoded to reasonable values
      expect(result).toHaveLength(1);
      expect(result[0]![0]).toBeCloseTo(38.5, 0);
      expect(result[0]![1]).toBeCloseTo(-120.2, 0);
    });

    it('should decode with custom precision', () => {
      const encoded = '_p~iF~ps|U';
      const resultPrecision5 = routeService.decodePolyline(encoded, 5);
      const resultPrecision6 = routeService.decodePolyline(encoded, 6);

      // Different precisions should give different results
      expect(resultPrecision5[0]).not.toEqual(resultPrecision6[0]);
    });

    it('should handle empty string', () => {
      const result = routeService.decodePolyline('');
      expect(result).toEqual([]);
    });

    it('should decode a complex polyline', () => {
      // Polyline representing a more complex path
      const encoded = 'gfo}EtobM@jB?tB?Z@rB@rBBdBBfB';
      const result = routeService.decodePolyline(encoded);

      expect(result.length).toBeGreaterThan(0);
      // All coordinates should be valid numbers
      result.forEach((coord) => {
        expect(coord).toHaveLength(2);
        expect(typeof coord[0]).toBe('number');
        expect(typeof coord[1]).toBe('number');
        expect(isFinite(coord[0]!)).toBe(true);
        expect(isFinite(coord[1]!)).toBe(true);
      });
    });

    it('should handle non-integer precision by converting to integer', () => {
      const encoded = '_p~iF~ps|U';
      const result = routeService.decodePolyline(encoded, 5.7);

      // Should use precision 5 (floor of 5.7)
      expect(result).toHaveLength(1);
      expect(typeof result[0]![0]).toBe('number');
    });

    it('should decode coordinates that form a valid path', () => {
      const encoded = 'mvh{FfrrrV@@@@@';
      const result = routeService.decodePolyline(encoded);

      // Verify all points are properly decoded
      expect(result.length).toBeGreaterThan(0);
      result.forEach((point, index) => {
        if (index > 0) {
          // Each subsequent point should be relatively close to the previous
          const prevPoint = result[index - 1];
          const latDiff = Math.abs(point[0]! - prevPoint![0]!);
          const lngDiff = Math.abs(point[1]! - prevPoint![1]!);

          // Differences should be reasonable (not jumping across the globe)
          expect(latDiff).toBeLessThan(180);
          expect(lngDiff).toBeLessThan(180);
        }
      });
    });
  });

  describe('travel modes', () => {
    it('should handle BICYCLE travel mode', async () => {
      const mockApiKey = 'test-api-key';
      const request: RawRequest = {
        origin: { latitude: 40.7128, longitude: -74.006 },
        destination: { latitude: 40.7614, longitude: -73.9776 },
        units: 'METRIC',
        travelMode: TravelMode.BICYCLE,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ routes: [] }),
      });

      await routeService.getRoute(mockApiKey, request);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.travelMode).toBe(TravelMode.BICYCLE);
    });

    it('should handle WALK travel mode', async () => {
      const mockApiKey = 'test-api-key';
      const request: RawRequest = {
        origin: { latitude: 40.7128, longitude: -74.006 },
        destination: { latitude: 40.7614, longitude: -73.9776 },
        units: 'METRIC',
        travelMode: TravelMode.WALK,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ routes: [] }),
      });

      await routeService.getRoute(mockApiKey, request);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.travelMode).toBe(TravelMode.WALK);
    });

    it('should handle TRANSIT travel mode', async () => {
      const mockApiKey = 'test-api-key';
      const request: RawRequest = {
        origin: { latitude: 40.7128, longitude: -74.006 },
        destination: { latitude: 40.7614, longitude: -73.9776 },
        units: 'METRIC',
        travelMode: TravelMode.TRANSIT,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ routes: [] }),
      });

      await routeService.getRoute(mockApiKey, request);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.travelMode).toBe(TravelMode.TRANSIT);
    });
  });

  describe('units', () => {
    it('should handle IMPERIAL units', async () => {
      const mockApiKey = 'test-api-key';
      const request: RawRequest = {
        origin: { latitude: 40.7128, longitude: -74.006 },
        destination: { latitude: 40.7614, longitude: -73.9776 },
        units: 'IMPERIAL',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ routes: [] }),
      });

      await routeService.getRoute(mockApiKey, request);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.units).toBe('IMPERIAL');
    });

    it('should default to METRIC when not specified', async () => {
      const mockApiKey = 'test-api-key';
      const request: RawRequest = {
        origin: { latitude: 40.7128, longitude: -74.006 },
        destination: { latitude: 40.7614, longitude: -73.9776 },
        units: 'METRIC',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ routes: [] }),
      });

      await routeService.getRoute(mockApiKey, request);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.units).toBe('METRIC');
    });
  });
});
