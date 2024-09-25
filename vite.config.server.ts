/// <reference types="vitest" />

import { defineConfig } from 'vite';
import nest from './vite-plugin-nestjs';

// https://vitejs.dev/config/
export default defineConfig(({ }) => ({
  esbuild: false,
  build: {
    outDir: 'dist/server',
    ssr: true,
    rollupOptions: {
      input: 'server/src/main.ts'
    },
  },  
  plugins: [
    nest({
      srcFilter: `${__dirname}/server`,
      entryServer: 'server/src/main.ts',
    })
  ],
}));
