import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoachesModule } from '../coaches/coaches.module';
import { TrainingJournalsModule } from '../training-journals/training-journals.module';
import { JournalAccessRepository } from './infrastructure/training-journal-access.repository';
import { JournalAccessUseCases } from './application/journal-access-use-cases.provider';
import { JournalAccessController } from './api/journal-access.controller';
import { JournalAccessQueries } from './application/journal-access-queries.provider';

@Module({
  imports: [CqrsModule, CoachesModule, TrainingJournalsModule],
  controllers: [JournalAccessController],
  providers: [
    JournalAccessRepository,
    ...JournalAccessUseCases,
    ...JournalAccessQueries,
  ],
})
export class JournalAccessModule {}
