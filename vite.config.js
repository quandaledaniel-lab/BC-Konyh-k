import { defineConfig } from 'vite';

export default defineConfig({
  // Set the base path to match the GitHub Pages repository name
  base: '/bckonyhak/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
