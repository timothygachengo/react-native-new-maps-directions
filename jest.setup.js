import { beforeAll, afterAll } from 'jest';
// Suppress act() warnings for async state updates in tests
// These warnings are expected in our tests as we're testing async behavior
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
