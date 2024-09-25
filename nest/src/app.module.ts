import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'node:path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'dist/client'),
      exclude: ['/api/(.*)'],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
