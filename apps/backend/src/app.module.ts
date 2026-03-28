import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './core/database/prisma/prisma.module';
import { AccountModule } from './features/accounts/account.module';
import { TrainingJournalsModule } from './features/training-journals/training-journals.module';
import { DashboardModule } from './features/dashboards/dashboard.module';

@Module({
  imports: [
    CoreModule,
    PrismaModule,
    AccountModule,
    TrainingJournalsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

