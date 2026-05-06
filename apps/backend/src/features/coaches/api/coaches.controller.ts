import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CoachProfileSearchView,
  CoachProfileView,
  coachesPaths,
  CreateCoachProfileInput,
  SportTypeEnum,
} from '@shared-types';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { CreateCoachProfileCommand } from '../application/use-cases/create-coach-profile.use-case';
import { CoachesRepository } from '../infrastructure/coaches.repository';

@Controller(coachesPaths.controller)
export class CoachesController {
  constructor(
    private commandBus: CommandBus,
    private coachesRepository: CoachesRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(coachesPaths.profiles)
  async getCoachProfiles(
    @Req() request: RequestWithUser,
  ): Promise<CoachProfileView[]> {
    const userId = request.user.userId;
    const profiles = await this.coachesRepository.getCoachProfilesByUserId(
      userId,
    );
    return profiles.map((profile) => ({
      id: profile.id,
      sportType: profile.sportType as SportTypeEnum,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Get(coachesPaths.availableSportTypes)
  async getAvailableCoachSportTypes(
    @Req() request: RequestWithUser,
  ): Promise<SportTypeEnum[]> {
    const userId = request.user.userId;
    const profiles = await this.coachesRepository.getCoachProfilesByUserId(
      userId,
    );
    const used = new Set(profiles.map((profile) => profile.sportType));
    return Object.values(SportTypeEnum).filter((sportType) => !used.has(sportType));
  }

  @UseGuards(JwtAuthGuard)
  @Get(coachesPaths.search)
  async searchCoachProfiles(
    @Req() request: RequestWithUser,
    @Query('sportType') sportType: SportTypeEnum,
    @Query('userName') userName: string,
  ): Promise<CoachProfileSearchView[]> {
    const userId = request.user.userId;
    const profiles = await this.coachesRepository.searchCoachProfilesByUserName(
      sportType,
      userName ?? '',
      userId,
    );
    return profiles.map((profile) => ({
      id: profile.id,
      sportType: profile.sportType as SportTypeEnum,
      userName: profile.user.userName,
    }));
  }

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
