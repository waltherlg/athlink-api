import { Module } from '@nestjs/common';
import { TrainingLogsRepository } from './infrastructure/training-logs.repository';
import { TrainingLogsController } from './api/training-logs.controller';
import { TrainingEntriesRepository } from './infrastructure/training-entries.repository';
import { TrainingLogUseCases } from './application/training-log-use-cases.provider';

@Module({
  imports: [],
  controllers: [TrainingLogsController],
  providers: [
    TrainingEntriesRepository,
    TrainingLogsRepository,
    ...TrainingLogUseCases,
  ],
  exports: [],
})
export class TrainingLogsModule {}
