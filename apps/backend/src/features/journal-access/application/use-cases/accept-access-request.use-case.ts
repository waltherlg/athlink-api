import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JournalAccessRepository } from '../../infrastructure/training-journal-access.repository';
import { PrismaService } from '../../../../core/database/prisma/prisma.service';
import {
  BadRequestDomainException,
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { JOURNAL_ACCESS_ERRORS } from '../../consts/coaches-errors.consts';
import { JournalAccessRoleEnum } from '@shared-types/dist';

export class AcceptAccessRequestCommand {
  constructor(
    public requestId: string,
    public coachUserId: string,
  ) {}
}

@CommandHandler(AcceptAccessRequestCommand)
export class AcceptAccessRequestUseCase implements ICommandHandler<AcceptAccessRequestCommand> {
  constructor(private prisma: PrismaService) {}
  async execute(command: AcceptAccessRequestCommand): Promise<void> {
    const { requestId, coachUserId } = command;

    await this.prisma.$transaction(async (tx) => {
      const request = await tx.accessRequest.findUnique({
        where: { id: requestId },
        include: {
          coachProfile: true,
        },
      });

      if (!request) {
        throw NotFoundDomainException.create(
          JOURNAL_ACCESS_ERRORS.REQUEST_NOT_FOUND,
        );
      }

      if (request.status !== 'PENDING') {
        throw BadRequestDomainException.create(
          JOURNAL_ACCESS_ERRORS.REQUEST_ALREADY_PROCESSED,
        );
      }

      if (request.coachProfile.userId !== coachUserId) {
        throw ForbiddenDomainException.create(JOURNAL_ACCESS_ERRORS.NOT_OWNER);
      }

      // 4. Проверка, что доступ ещё не существует
      const existingAccess = await tx.journalAccess.findUnique({
        where: {
          coachProfileId_journalId: {
            coachProfileId: request.coachProfileId,
            journalId: request.journalId,
          },
        },
      });

      if (existingAccess) {
        throw BadRequestDomainException.create(
          JOURNAL_ACCESS_ERRORS.ACCESS_ALREADY_EXISTS,
        );
      }

      await tx.journalAccess.create({
        data: {
          coachProfileId: request.coachProfileId,
          journalId: request.journalId,
          role: JournalAccessRoleEnum.COACH,
        },
      });

      await tx.accessRequest.update({
        where: { id: request.id },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
        },
      });
    });
  }
}
