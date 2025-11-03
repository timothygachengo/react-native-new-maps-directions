// Mock react-native-maps before importing
jest.mock('react-native-maps', () => ({
  MapPolyline: 'MapPolyline',
}));

describe('index exports', () => {
  it('should export MapViewDirections component', async () => {
    // Dynamically import to test exports without triggering native modules
    const indexModule = await import('../index');
    expect(indexModule.MapViewDirections).toBeDefined();
    expect(typeof indexModule.MapViewDirections).toBe('function');
  });

  it('should have all expected exports from index', async () => {
    const indexModule = await import('../index');
    const exportNames = Object.keys(indexModule);

    expect(exportNames).toContain('MapViewDirections');
    expect(exportNames).toContain('RouteService');
    expect(exportNames).toContain('TravelMode');
    expect(exportNames).toContain('RoutingPreference');
  });
});
