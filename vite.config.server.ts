/// <reference types="vitest" />

import { defineConfig } from 'vite';
import { RollupPluginSwc } from './plugin';

// https://vitejs.dev/config/
export default defineConfig(({ }) => ({
  esbuild: false,
  build: {
    outDir: 'dist/analog/server',
    ssr: true,
    rollupOptions: {
      input: 'nest/src/main.ts'
    },
  },
  optimizeDeps: {
    exclude: [
      '@swc/core',
      '@nestjs/microservices',
      '@nestjs/websockets',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-swagger',
    ],
  },  
  plugins: [
    RollupPluginSwc({
      module: {
        type: 'es6',
      },
      jsc: {
        target: 'es2019',
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
}));
