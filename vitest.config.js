import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Import path module

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom'
    setupFiles: ['./vitest.setup.js'], // Optional: for global test setup
    coverage: { // Optional: configure code coverage
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: { // Add resolve alias to match webpack config
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});