import { CqrsModule } from '@nestjs/cqrs';
import { CoachesRepository } from './infrastructure/coaches.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [CoachesRepository],
  exports: [CoachesRepository],
})
export class CoachesModule {}
