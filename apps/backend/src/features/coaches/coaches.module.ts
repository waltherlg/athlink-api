import { CqrsModule } from '@nestjs/cqrs';
import { CoachesRepository } from './infrastructure/coaches.repository';
import { Module } from '@nestjs/common';
import { CoachesUseCases } from './application/coaches-use-cases.provider';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [CoachesRepository, ...CoachesUseCases],
  exports: [CoachesRepository],
})
export class CoachesModule {}
