import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { UserModule } from './features/users/user.module';
import { AuthModule } from './features/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CoreModule, PrismaModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
