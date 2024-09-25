import type { Options } from '@swc/core';
import { normalizePath, type Plugin } from 'vite';

export function RollupPluginSwc(options: Options, { srcFilter }: { srcFilter: string }): Plugin {
  let swc: any;
  const config: Options = {
    ...options,
  };

  return {
    name: 'analogjs-vite-plugin-nestjs-swc',
    async transform(code, id) {
      if (id.includes(normalizePath(srcFilter))) {
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