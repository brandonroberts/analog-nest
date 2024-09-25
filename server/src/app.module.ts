import { Module, OnModuleInit } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HttpAdapterHost } from '@nestjs/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ...(import.meta.env.PROD
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'dist', 'client'),
            exclude: ['/services/(.*)', ''],
          })
        ] : [])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  async onModuleInit() {
    if (!import.meta.env.PROD) {
      return;
    }

    if (!this.httpAdapterHost) {
      return;
    }
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    if (!httpAdapter) {
      return;
    }
    const app = httpAdapter.getInstance();
    const template = readFileSync(join(process.cwd(), 'dist', 'client', 'index.html'), 'utf-8');
    
    const renderer = (await import(/* @vite-ignore */join(process.cwd(), 'dist', 'ssr', 'main.server.js')))['default'];

    app.get('**', async(req, res) => {
      const html = await renderer(req.url, template, { req, res });
      res.status(200);
      return res.end(html);
    });
  }
}
