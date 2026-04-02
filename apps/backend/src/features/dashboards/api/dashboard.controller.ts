import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { dashboardPaths } from '@shared-types';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { GetAthleteDesboardQuery } from '../application/query-handlers/get-athlete-dashboard.query-handler';
import {
  GetAthleteDashboardSwagger,
  SW_DASHBOARD_TITLES,
} from './swagger/dashboard.swagger';

@ApiTags(SW_DASHBOARD_TITLES.DASHBOARD_CONTROLLER)
@Controller(dashboardPaths.controller)
export class DashboardController {
  constructor(private queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @GetAthleteDashboardSwagger()
  @Get(dashboardPaths.athlete)
  async getAthleteDesboard(@Req() request: RequestWithUser) {
    const athleteId = request.user.id;
    return this.queryBus.execute(new GetAthleteDesboardQuery(athleteId));
  }
}
