import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { AccountModule } from '../accounts/account.module';
import { TrainingLogsModule } from '../training-logs/training-logs.module';
import { DashboardController } from './api/dashboard.controller';

@Module({
  imports: [CoreModule, AccountModule, TrainingLogsModule],
  controllers: [DashboardController],
  providers: [],
})
export class DashboardModule {}
