/// <reference types="vitest" />

import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

import { NestHandler } from './adapter';
import { RollupPluginSwc } from './plugin';

// https://vitejs.dev/config/
export default defineConfig(({ }) => ({
  build: {
    outDir: 'dist/analog/public',
    target: ['es2020']
  },
  resolve: {
    mainFields: ['module'],
  },
  optimizeDeps: {
    exclude: [
      '@nestjs/microservices',
      '@nestjs/websockets',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-swagger',
    ],
  },  
  plugins: [
    angular({
      transformFilter(_code, id) {
        return !id.includes('/nest/');
      }
    }),
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
    {
      name: 'api',
      async configureServer(server) {        
        server.middlewares.use('/api', async(req, res) => {
          const appModule = await server.ssrLoadModule(`nest/src/main.ts`);
          let app = appModule['nestApp'];
          app = await app;

          return await NestHandler({ app, req, res });
        })
      }
    }
  ],
}));
