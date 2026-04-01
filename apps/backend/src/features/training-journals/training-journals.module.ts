import { Module } from '@nestjs/common';
import { TrainingJournalsRepository } from './infrastructure/training-journals.repository';
import { TrainingJournalsController } from './api/training-journals.controller';
import { TrainingRecordsRepository } from './infrastructure/training-records.repository';
import { TrainingJournalUseCases } from './application/training-journal-use-cases.provider';
import { CqrsModule } from '@nestjs/cqrs';
import { TrainingJournalQueries } from './application/training-journal-queries.provider';

@Module({
  imports: [CqrsModule],
  controllers: [TrainingJournalsController],
  providers: [
    TrainingRecordsRepository,
    TrainingJournalsRepository,
    ...TrainingJournalUseCases,
    ...TrainingJournalQueries,
  ],
  exports: [TrainingRecordsRepository, TrainingJournalsRepository],
})
export class TrainingJournalsModule {}


