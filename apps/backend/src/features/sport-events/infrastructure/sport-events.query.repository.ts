import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';

@Injectable()
export class SportEventQueryRepository {
  constructor(prisma: PrismaService) {}

  async getEventsBySportType() {}
}
