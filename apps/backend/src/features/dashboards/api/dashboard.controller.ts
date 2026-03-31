import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { dashboardPaths } from '@shared-types';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';

@Controller(dashboardPaths.controller)
export class DashboardController {
  constructor(commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Get(dashboardPaths.athlete)
  async getAthleteDesboard(@Req() request: RequestWithUser) {}
}
