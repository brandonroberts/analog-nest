import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

if (import.meta.env.PROD) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule, {});
    app.setGlobalPrefix('api');

    await app.listen(3000);
  }

  bootstrap();
}

export const nestApp = NestFactory.create(AppModule);