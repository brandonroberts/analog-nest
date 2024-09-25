
import { NestFactory } from '@nestjs/core';
import { Controller, Get, Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Injectable()
export class AppService {
  getHello() {
    return {message: 'Hello World'};
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}

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


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  await app.listen(3000);
}

export const nestApp = NestFactory.create(AppModule);
if (process.env['NODE_ENV'] === "production") {
  bootstrap();
}