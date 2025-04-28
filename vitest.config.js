export default {
  test: {
    fileParallelism: false,
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    globalSetup: ['./tests/init.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js'],
    },
  },
}; 