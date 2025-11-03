import { render, waitFor } from '@testing-library/react-native';
import { MapViewDirections } from '../MapViewDirections';
import { RouteService } from '../route-service';
import { TravelMode } from '../types';

// Mock react-native-maps
jest.mock('react-native-maps', () => ({
  MapPolyline: 'MapPolyline',
}));

// Mock RouteService
jest.mock('../route-service');

describe('MapViewDirections', () => {
  const mockApiKey = 'test-api-key';
  const mockOrigin = { latitude: 40.7128, longitude: -74.006 };
  const mockDestination = { latitude: 34.0522, longitude: -118.2437 };

  const mockRouteResponse = {
    routes: [
      {
        legs: [
          {
            distanceMeters: 4490000,
            duration: '42000s',
            staticDuration: '42000s',
            polyline: { encodedPolyline: '_p~iF~ps|U_ulLnnqC_mqNvxq`@' },
            startLocation: {
              latLng: mockOrigin,
            },
            endLocation: {
              latLng: mockDestination,
            },
            steps: [],
            localizedValues: {
              distance: { text: '4,490 km' },
              duration: { text: '11 hours 40 mins' },
              staticDuration: { text: '11 hours 40 mins' },
            },
          },
        ],
        distanceMeters: 4490000,
        duration: '42000s',
        staticDuration: '42000s',
        polyline: { encodedPolyline: '_p~iF~ps|U_ulLnnqC_mqNvxq`@' },
        description: 'Route 1',
        warnings: [],
        viewport: {
          low: mockDestination,
          high: mockOrigin,
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

  const mockDecodedPolyline = [
    [38.5, -120.2],
    [40.7, -120.95],
    [43.252, -126.453],
  ];

  let mockRouteService: jest.Mocked<RouteService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouteService = {
      getRoute: jest.fn(),
      decodePolyline: jest.fn(),
    } as any;

    (RouteService as jest.Mock).mockImplementation(() => mockRouteService);

    mockRouteService.getRoute.mockResolvedValue(mockRouteResponse);
    mockRouteService.decodePolyline.mockReturnValue(mockDecodedPolyline);

    // Suppress console warnings in tests
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render null when coordinates are not loaded', () => {
      const { toJSON } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      // Initially should render null
      expect(toJSON()).toBeNull();
    });

    it('should render MapPolyline when coordinates are loaded', async () => {
      const { UNSAFE_getByType } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          testID="map-polyline"
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalled();
      });

      await waitFor(() => {
        const polyline = UNSAFE_getByType('MapPolyline' as any);
        expect(polyline).toBeTruthy();
      });
    });

    it('should pass through MapPolyline props', async () => {
      const { UNSAFE_getByType } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          strokeWidth={5}
          strokeColor="red"
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalled();
      });

      await waitFor(() => {
        const polyline = UNSAFE_getByType('MapPolyline' as any);
        expect(polyline.props.strokeWidth).toBe(5);
        expect(polyline.props.strokeColor).toBe('red');
      });
    });
  });

  describe('API calls', () => {
    it('should fetch route on mount with valid origin and destination', async () => {
      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledWith(
          mockApiKey,
          expect.objectContaining({
            origin: mockOrigin,
            destination: mockDestination,
            units: 'METRIC',
          })
        );
      });
    });

    it('should not fetch route when apikey is missing', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn');

      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey=""
        />
      );

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'MapViewDirections Error: Missing API Key'
        );
      });

      expect(mockRouteService.getRoute).not.toHaveBeenCalled();
    });

    it('should not fetch route when origin is missing', () => {
      render(
        <MapViewDirections destination={mockDestination} apikey={mockApiKey} />
      );

      expect(mockRouteService.getRoute).not.toHaveBeenCalled();
    });

    it('should not fetch route when destination is missing', () => {
      render(<MapViewDirections origin={mockOrigin} apikey={mockApiKey} />);

      expect(mockRouteService.getRoute).not.toHaveBeenCalled();
    });

    it('should include travel mode when provided', async () => {
      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          travelMode={TravelMode.BICYCLE}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledWith(
          mockApiKey,
          expect.objectContaining({
            travelMode: TravelMode.BICYCLE,
          })
        );
      });
    });

    it('should include language code when provided', async () => {
      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          languageCode="es-ES"
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledWith(
          mockApiKey,
          expect.objectContaining({
            languageCode: 'es-ES',
          })
        );
      });
    });

    it('should default to en-US language code when not provided', async () => {
      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledWith(
          mockApiKey,
          expect.objectContaining({
            languageCode: 'en-US',
          })
        );
      });
    });
  });

  describe('callbacks', () => {
    it('should call onReady callback with route response', async () => {
      const onReady = jest.fn();

      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          onReady={onReady}
        />
      );

      await waitFor(() => {
        expect(onReady).toHaveBeenCalledWith(mockRouteResponse.routes[0]);
      });
    });

    it('should call onStart callback', async () => {
      const onStart = jest.fn();

      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          onStart={onStart}
        />
      );

      await waitFor(() => {
        expect(onStart).toHaveBeenCalledWith(mockRouteResponse.routes[0]);
      });
    });

    it('should call onError callback when route fetch fails', async () => {
      const onError = jest.fn();
      const errorMessage = 'Network error';
      mockRouteService.getRoute.mockRejectedValueOnce(new Error(errorMessage));

      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          onError={onError}
        />
      );

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it('should not call onReady when response is empty', async () => {
      const onReady = jest.fn();
      mockRouteService.getRoute.mockResolvedValueOnce({
        routes: [],
      } as any);

      render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          onReady={onReady}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalled();
      });

      // Wait a bit to ensure callback is not called
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(onReady).not.toHaveBeenCalled();
    });
  });

  describe('polyline decoding', () => {
    it('should decode polyline and set coordinates', async () => {
      const { UNSAFE_getByType } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.decodePolyline).toHaveBeenCalledWith(
          '_p~iF~ps|U_ulLnnqC_mqNvxq`@'
        );
      });

      await waitFor(() => {
        const polyline = UNSAFE_getByType('MapPolyline' as any);
        expect(polyline.props.coordinates).toEqual([
          { latitude: 38.5, longitude: -120.2 },
          { latitude: 40.7, longitude: -120.95 },
          { latitude: 43.252, longitude: -126.453 },
        ]);
      });
    });

    it('should handle missing polyline gracefully', async () => {
      mockRouteService.getRoute.mockResolvedValueOnce({
        routes: [
          {
            ...mockRouteResponse.routes[0]!,
            polyline: { encodedPolyline: '' },
          },
        ],
      } as any);

      const { toJSON } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalled();
      });

      // Should not crash, should render null
      expect(toJSON()).toBeNull();
    });
  });

  describe('prop changes', () => {
    it('should refetch route when origin changes', async () => {
      const { rerender } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(1);
      });

      const newOrigin = { latitude: 41.8781, longitude: -87.6298 };
      rerender(
        <MapViewDirections
          origin={newOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(2);
        expect(mockRouteService.getRoute).toHaveBeenLastCalledWith(
          mockApiKey,
          expect.objectContaining({
            origin: newOrigin,
          })
        );
      });
    });

    it('should refetch route when destination changes', async () => {
      const { rerender } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(1);
      });

      const newDestination = { latitude: 41.8781, longitude: -87.6298 };
      rerender(
        <MapViewDirections
          origin={mockOrigin}
          destination={newDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(2);
        expect(mockRouteService.getRoute).toHaveBeenLastCalledWith(
          mockApiKey,
          expect.objectContaining({
            destination: newDestination,
          })
        );
      });
    });

    it('should refetch route when travel mode changes', async () => {
      const { rerender } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          travelMode={TravelMode.DRIVE}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(1);
      });

      rerender(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          travelMode={TravelMode.WALK}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(2);
        expect(mockRouteService.getRoute).toHaveBeenLastCalledWith(
          mockApiKey,
          expect.objectContaining({
            travelMode: TravelMode.WALK,
          })
        );
      });
    });

    it('should refetch route when apikey changes', async () => {
      const { rerender } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(1);
      });

      const newApiKey = 'new-api-key';
      rerender(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={newApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(2);
        expect(mockRouteService.getRoute).toHaveBeenLastCalledWith(
          newApiKey,
          expect.anything()
        );
      });
    });
  });

  describe('resetOnChange prop', () => {
    it('should reset state when resetOnChange is true and props change', async () => {
      const { rerender, toJSON } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          resetOnChange={true}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(1);
      });

      // Wait for polyline to render
      await waitFor(() => {
        expect(toJSON()).not.toBeNull();
      });

      const newOrigin = { latitude: 41.8781, longitude: -87.6298 };

      // Reset mock to simulate fresh state
      mockRouteService.getRoute.mockClear();
      mockRouteService.getRoute.mockImplementation(
        () => new Promise(() => {}) // Never resolve to see null state
      );

      rerender(
        <MapViewDirections
          origin={newOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          resetOnChange={true}
        />
      );

      // Should render null briefly during reset
      expect(toJSON()).toBeNull();
    });

    it('should not reset state when resetOnChange is false', async () => {
      const { rerender, UNSAFE_queryByType } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          resetOnChange={false}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalledTimes(1);
      });

      // Wait for initial polyline to render
      await waitFor(() => {
        expect(UNSAFE_queryByType('MapPolyline' as any)).toBeTruthy();
      });

      const newOrigin = { latitude: 41.8781, longitude: -87.6298 };
      rerender(
        <MapViewDirections
          origin={newOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
          resetOnChange={false}
        />
      );

      // Polyline should still be present (not reset)
      expect(UNSAFE_queryByType('MapPolyline' as any)).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle coordinates with zero values', async () => {
      mockRouteService.decodePolyline.mockReturnValue([
        [0, 0],
        [0, 0],
      ]);

      const { UNSAFE_getByType } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalled();
      });

      await waitFor(() => {
        const polyline = UNSAFE_getByType('MapPolyline' as any);
        expect(polyline.props.coordinates).toEqual([
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0 },
        ]);
      });
    });

    it('should handle single point polyline', async () => {
      mockRouteService.decodePolyline.mockReturnValue([[40.7128, -74.006]]);

      const { UNSAFE_getByType } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalled();
      });

      await waitFor(() => {
        const polyline = UNSAFE_getByType('MapPolyline' as any);
        expect(polyline.props.coordinates).toHaveLength(1);
      });
    });

    it('should handle route response without polyline property', async () => {
      mockRouteService.getRoute.mockResolvedValueOnce({
        routes: [
          {
            ...mockRouteResponse.routes[0]!,
            polyline: undefined as any,
          },
        ],
      });

      const { toJSON } = render(
        <MapViewDirections
          origin={mockOrigin}
          destination={mockDestination}
          apikey={mockApiKey}
        />
      );

      await waitFor(() => {
        expect(mockRouteService.getRoute).toHaveBeenCalled();
      });

      // Should handle gracefully and render null
      expect(toJSON()).toBeNull();
    });
  });
});
