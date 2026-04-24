const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/tests/scratch.test.js', // ad-hoc scratch file, not a real test suite
    ],
    reporters: ['verbose'],
  },
});
