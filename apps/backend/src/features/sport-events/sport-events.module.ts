import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SportEventController } from './api/sport-event.controller';
import { SportEventQueryRepository } from './infrastructure/sport-events.query.repository';

@Module({
  imports: [CqrsModule],
  controllers: [SportEventController],
  providers: [SportEventQueryRepository],
  exports: [SportEventQueryRepository],
})
export class SportEventModule {}
