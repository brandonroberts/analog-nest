import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ...(import.meta.env.PROD
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'dist', '/client'),
            exclude: ['/api/(.*)'],
          })
        ] : [])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
