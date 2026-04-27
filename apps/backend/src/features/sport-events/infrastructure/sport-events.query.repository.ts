import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { SportTypeEnum } from '@shared-types';
import { SportEvent } from '@prisma/client';

@Injectable()
export class SportEventQueryRepository {
  constructor(private prisma: PrismaService) {}

  async getEventsBySportType(sportType: SportTypeEnum): Promise<SportEvent[]> {
    const events: SportEvent[] = await this.prisma.sportEvent.findMany({
      where: { sportType },
      orderBy: { code: 'asc' },
    });
    return events;
  }
}
