import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreEnvironmentConfig } from './core/config/core-env.config';

async function bootstrap() {
  const appContext = await NestFactory.create(AppModule);
  const config = appContext.get<CoreEnvironmentConfig>(CoreEnvironmentConfig);
  appContext.enableCors({
    origin: true,
    credentials: true,
  });
  const port = config.port;

  appSetup(appContext);
  await appContext.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
