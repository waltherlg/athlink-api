import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreModule } from '../../core/core.module';
import { AccountModule } from '../accounts/account.module';
import { TrainingJournalsModule } from '../training-journals/training-journals.module';
import { DashboardController } from './api/dashboard.controller';
import { GetAthleteDesboardQueryHandler } from './application/query-handlers/get-athlete-dashboard.query-handler';

@Module({
  imports: [CoreModule, AccountModule, TrainingJournalsModule, CqrsModule],
  controllers: [DashboardController],
  providers: [GetAthleteDesboardQueryHandler],
})
export class DashboardModule {}

