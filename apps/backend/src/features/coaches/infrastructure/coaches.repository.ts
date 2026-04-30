import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { createCoachProfileDto } from '../application/dto/domain-coach.dto';
import { CoachProfile } from '@prisma/client';
import { SportTypeEnum } from '@shared-types';

@Injectable()
export class CoachesRepository {
  constructor(private prisma: PrismaService) {}

  async createCoachProfile(dto: createCoachProfileDto): Promise<CoachProfile> {
    const createdProfile = await this.prisma.coachProfile.create({
      data: { ...dto },
    });
    return createdProfile;
  }

  async getCoachProfileByUserIdAndSportType(
    userId: string,
    sportType: SportTypeEnum,
  ): Promise<CoachProfile | null> {
    const profile = await this.prisma.coachProfile.findUnique({
      where: {
        userId_sportType: {
          userId: userId,
          sportType: sportType,
        },
      },
    });
    return profile;
  }
}
