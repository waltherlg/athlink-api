import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { AccountModule } from './features/accounts/account.module';
import { TrainingLogsModule } from './features/training-logs/training-logs.module';
import { DashboardModule } from './features/dashboards/dashboard.module';

@Module({
  imports: [
    CoreModule,
    PrismaModule,
    AccountModule,
    TrainingLogsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
