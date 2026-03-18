import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreEnvironmentConfig } from './config/core-env.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.ENV_FILE_PATH?.trim(),
        `.${process.env.NODE_ENV}.local.env`,
        `.${process.env.NODE_ENV}.env`,
        '.production.env',
      ].filter(Boolean),
      isGlobal: true,
    }),
  ],
  providers: [CoreEnvironmentConfig],
  exports: [CoreEnvironmentConfig],
})
export class CoreModule {}
