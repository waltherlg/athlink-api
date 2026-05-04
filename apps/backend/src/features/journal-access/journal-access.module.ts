import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoachesModule } from '../coaches/coaches.module';
import { TrainingJournalsModule } from '../training-journals/training-journals.module';
import { JournalAccessRepository } from './infrastructure/training-journal-access.repository';
import { JournalAccessUseCases } from './application/journal-access-use-cases.provider';

@Module({
  imports: [CqrsModule, CoachesModule, TrainingJournalsModule],
  providers: [JournalAccessRepository, ...JournalAccessUseCases],
})
export class JournalAccessModule {}
