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

  async getCoachProfilesByUserId(userId: string): Promise<CoachProfile[]> {
    return this.prisma.coachProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async searchCoachProfilesByUserName(
    sportType: SportTypeEnum,
    userName: string,
    currentUserId: string,
  ) {
    const search = userName.trim();
    if (search.length === 0) return [];

    return this.prisma.coachProfile.findMany({
      where: {
        sportType,
        userId: { not: currentUserId },
        user: {
          userName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      include: {
        user: {
          select: { userName: true },
        },
      },
      orderBy: { user: { userName: 'asc' } },
      take: 8,
    });
  }
}
