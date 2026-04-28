import { Controller, Get, ParseEnumPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SportEventQueryRepository } from '../infrastructure/sport-events.query.repository';
import { ResultTypeEnum, SportTypeEnum, sportEventPaths } from '@shared-types';
import { SportEventViewDto } from './dto/sport-event.dto';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import {
  GetSportEventsSwagger,
  SW_SPORT_EVENTS_TITLES,
} from './swagger/sport-events.swagger';
import { SportEvent } from '@prisma/client';

@ApiTags(SW_SPORT_EVENTS_TITLES.SPORT_EVENT_CONTROLLER)
@Controller(sportEventPaths.controller)
export class SportEventController {
  constructor(private sportEventsRepo: SportEventQueryRepository) {}

  @GetSportEventsSwagger()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getSportEventsBySportType(
    @Query('sportType', new ParseEnumPipe(SportTypeEnum))
    sportType: SportTypeEnum,
  ): Promise<SportEventViewDto[]> {
    const sportEvents = await this.sportEventsRepo.getEventsBySportType(
      sportType,
    );
    return sportEvents.map(mapSportEventView);
  }
}

function mapSportEventView(event: SportEvent): SportEventViewDto {
  return {
    id: event.id,
    sportType: event.sportType as SportTypeEnum,
    code: event.code,
    name: event.name,
    resultType: event.resultType as ResultTypeEnum,
    maxScore: event.maxScore,
    decimals: event.decimals,
    createdAt: event.createdAt.toISOString(),
  };
}
