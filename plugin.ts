import { createFilter } from '@rollup/pluginutils';
import type { Compiler, Options } from '@swc/core';
import type { Plugin } from 'vite';
// import { cleanUrl } from './utils';

export function RollupPluginSwc(options: Options): Plugin {
  let swc: any;
  // todo: load swc/tsconfig from config files
  const config: Options = {
    // options from swc config
    ...options,
  };

  const filter = createFilter(/\.(tsx?|jsx)$/, /\.js$/);

  return {
    name: 'rollup-plugin-swc',
    async transform(code, id) {
      if (id.includes('/nest/')) {
        if (!swc)
          swc = await import('@swc/core');

        const result = await swc.transform(code, {
          ...config,
          filename: id,
        });
        return {
          code: result.code,
          map: result.map,
        };
      }
      return;
    },
  };
}