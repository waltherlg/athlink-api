import { Global, Module } from '@nestjs/common';
import { CoreConfigModule } from './config/core-config.module';
import { EmailModule } from './email/email.module';

@Global()
@Module({
  imports: [CoreConfigModule, EmailModule],
  exports: [CoreConfigModule, EmailModule],
})
export class CoreModule {}
