import { CqrsModule } from '@nestjs/cqrs';
import { CoachesRepository } from './infrastructure/coaches.repository';
import { Module } from '@nestjs/common';
import { CoachesUseCases } from './application/coaches-use-cases.provider';
import { CoachesController } from './api/coaches.controller';

@Module({
  imports: [CqrsModule],
  controllers: [CoachesController],
  providers: [CoachesRepository, ...CoachesUseCases],
  exports: [CoachesRepository],
})
export class CoachesModule {}
