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
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    hookTimeout: 30000,
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/tests/scratch.test.js',
    ],
    reporters: ['verbose'],
  },
});