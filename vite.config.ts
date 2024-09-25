/// <reference types="vitest" />

import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

import { NestHandler } from './adapter';
import { RollupPluginSwc } from './plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    angular({
      transformFilter(code, id) {
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
        const appModule = await server.ssrLoadModule('nest/src/main.ts');
        let app = appModule['nestApp'];
        app = await app;

        server.middlewares.use('/api', async(req, res) => {
          await NestHandler({ app, req, res });
        })
      }
    }
  ],
}));
