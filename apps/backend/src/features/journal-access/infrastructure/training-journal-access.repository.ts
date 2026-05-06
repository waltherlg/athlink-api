import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import {
  CreateJournalAccessRequestDto,
  CreateJournalAccesstDto,
} from '../application/dto/journal-access-request-domain.dto';
import { AccessRequest, JournalAccess, RequestStatus } from '@prisma/client';

@Injectable()
export class JournalAccessRepository {
  constructor(private prisma: PrismaService) {}

  async createAccessRequest(
    dto: CreateJournalAccessRequestDto,
  ): Promise<AccessRequest> {
    const accessRequest = await this.prisma.accessRequest.create({
      data: { ...dto },
    });
    return accessRequest;
  }

  async createAccess(dto: CreateJournalAccesstDto): Promise<JournalAccess> {
    const access = await this.prisma.journalAccess.create({
      data: { ...dto },
    });
    return access;
  }

  async acceptAccessRequest(id: string) {
    await this.prisma.accessRequest.update({
      where: { id },
      data: { status: RequestStatus.ACCEPTED, respondedAt: new Date() },
    });
  }

  async rejectAccessRequest(id: string) {
    await this.prisma.accessRequest.update({
      where: { id },
      data: { status: RequestStatus.REJECTED, respondedAt: new Date() },
    });
  }

  async getPendingIncomingRequests(coachUserId: string) {
    return this.prisma.accessRequest.findMany({
      where: {
        status: RequestStatus.PENDING,
        coachProfile: {
          userId: coachUserId,
        },
      },
      include: {
        journal: {
          include: {
            athlete: {
              select: { userName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countPendingIncomingRequests(coachUserId: string): Promise<number> {
    return this.prisma.accessRequest.count({
      where: {
        status: RequestStatus.PENDING,
        coachProfile: {
          userId: coachUserId,
        },
      },
    });
  }
}
