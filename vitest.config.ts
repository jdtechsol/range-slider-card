import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Make Vitest APIs available globally like Jest
    environment: 'jsdom', // Simulate a browser environment for testing DOM interactions
    // Optional: Add setup files if needed (e.g., for polyfills or global mocks)
    // setupFiles: './src/setupTests.ts',
    include: ['src/**/*.test.ts'], // Pattern to find test files
  },
});
