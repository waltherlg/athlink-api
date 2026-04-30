import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { coachesPaths, CreateCoachProfileInput } from '@shared-types';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { CreateCoachProfileCommand } from '../application/use-cases/create-coach-profile.use-case';

@Controller(coachesPaths.controller)
export class CoachesController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCoachProfile(
    @Req() request: RequestWithUser,
    @Body() dto: CreateCoachProfileInput,
  ) {
    const userId = request.user.userId;
    const sportType = dto.sportType;
    const result = await this.commandBus.execute(
      new CreateCoachProfileCommand(userId, sportType),
    );
    return result;
  }
}
