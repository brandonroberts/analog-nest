/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

import nest from './vite-plugin-nestjs';

// https://vitejs.dev/config/
export default defineConfig(({ }) => ({
  build: {
    outDir: 'dist/client',
    target: ['es2020']
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      vite: {
        transformFilter(_code, id) {
          return !id.includes(`${__dirname}/server`);
        },
      },
      prerender: {
        routes: []
      }
    }),
    nest({
      srcFilter: `${__dirname}/server`,
      entryServer: 'server/src/main.ts',
      apiPrefix: '/services'
    })
  ],
}));
