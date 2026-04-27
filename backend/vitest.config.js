const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    env: {
      JWT_SECRET: 'test_secret_for_vitest',
      SESSION_SECRET: 'test_secret_for_session',
      GOOGLE_CLIENT_ID: 'test_google_client_id',
    },
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/tests/scratch.test.js', // ad-hoc scratch file, not a real test suite
    ],
    reporters: ['verbose'],
  },
});
