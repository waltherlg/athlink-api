import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { AccountModule } from '../accounts/account.module';
import { TrainingJournalsModule } from '../training-journals/training-journals.module';
import { DashboardController } from './api/dashboard.controller';

@Module({
  imports: [CoreModule, AccountModule, TrainingJournalsModule],
  controllers: [DashboardController],
  providers: [],
})
export class DashboardModule {}

