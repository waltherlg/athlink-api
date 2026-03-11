import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { EnvironmentConfig } from './core/config/env.config';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import * as zod from 'zod';

async function bootstrap() {
  extendZodWithOpenApi(zod);
  const appContext = await NestFactory.create(AppModule);
  const config = appContext.get<EnvironmentConfig>(EnvironmentConfig);
  const port = config.port;

  appSetup(appContext);
  await appContext.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
