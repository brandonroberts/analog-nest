import type { INestApplication } from '@nestjs/common';
import { ViteDevServer, Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

export declare interface RequestAdapterParams<App> {
  app: App
  server: ViteDevServer
  req: IncomingMessage
  res: ServerResponse
  next: Connect.NextFunction
}

export declare type RequestAdapter<App = any> = (params: RequestAdapterParams<App>) => void | Promise<void>;


let prevApp: INestApplication;

export const NestHandler: any = async ({ app, req, res }: any) => {
  if (!(app as any).isInitialized) {
    if (prevApp)
      await prevApp.close();

    await app.init();
    prevApp = app;
  }

  const instance = app.getHttpAdapter().getInstance();

  if (typeof instance === 'function') {
    instance(req, res);
  } else {
    const fastifyApp = await instance.ready();
    fastifyApp.routing(req, res);
  }
};