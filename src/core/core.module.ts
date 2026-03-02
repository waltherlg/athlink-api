import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfig } from './config/env.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [EnvironmentConfig],
  exports: [EnvironmentConfig],
})
export class CoreModule {}
