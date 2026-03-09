import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { UserModule } from './features/users/user.module';
import { RegistrationModule } from './features/registration/registration.module';

@Module({
  imports: [CoreModule, PrismaModule, UserModule, RegistrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
