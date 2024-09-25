import { mergeConfig, Plugin } from 'vite';
import type { Options } from '@swc/core';

import { NestHandler } from '../adapter';
import { RollupPluginSwc } from './rollup-swc-plugin';

export interface NestPluginOptions {
  entryServer?: string;
  apiPrefix?: string;
  swc?: Options;
  srcFilter?: string;
}

export default function nestPlugin(options?: NestPluginOptions): Plugin[] {
  const entryServer = options?.entryServer || 'api/src/main.ts';
  const apiPrefix = options?.apiPrefix || '/api';
  const srcFilter = options?.srcFilter || '/server';

  return [
    {
      name: 'analogjs-vite-plugin-nestjs',
      config() {
        return {          
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
        }        
      }
    },
    RollupPluginSwc(mergeConfig({
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
    }, options?.swc || { }), { srcFilter }),
    {
      name: 'analogjs-vite-plugin-nestjs-api',
      async configureServer(server) {
        server.middlewares.use(apiPrefix, async(req, res) => {
          const appModule = await server.ssrLoadModule(entryServer);
          let app = appModule['nestApp'];
          app = await app;

          return await NestHandler({ app, req, res });
        })

        console.log(`\n\nThe server endpoints are accessible under the "${apiPrefix}" path.`);
      }
    }
  ]
}