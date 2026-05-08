import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestDomainException,
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { JOURNAL_ACCESS_ERRORS } from '../../consts/coaches-errors.consts';
import { PrismaService } from '../../../../core/database/prisma/prisma.service';

export class CreateAccessRequestCommand {
  constructor(
    public athleteId: string,
    public journalId: string,
    public coachProfileId: string,
  ) {}
}

@CommandHandler(CreateAccessRequestCommand)
export class CreateAccessRequestUseCase implements ICommandHandler<CreateAccessRequestCommand> {
  constructor(private prisma: PrismaService) {}

  async execute(command: CreateAccessRequestCommand): Promise<{ id: string }> {
    const { athleteId, journalId, coachProfileId } = command;

    const journal = await this.prisma.trainingJournal.findUnique({
      where: { id: journalId },
    });

    if (!journal) {
      throw NotFoundDomainException.create(
        JOURNAL_ACCESS_ERRORS.JOURNAL_NOT_FOUND,
      );
    }

    if (journal.athleteId !== athleteId) {
      throw ForbiddenDomainException.create(JOURNAL_ACCESS_ERRORS.NOT_OWNER);
    }

    const coachProfile = await this.prisma.coachProfile.findUnique({
      where: { id: coachProfileId },
    });

    if (!coachProfile) {
      throw NotFoundDomainException.create(
        JOURNAL_ACCESS_ERRORS.COACH_PROFILE_NOT_FOUND,
      );
    }

    if (coachProfile.sportType !== journal.sportType) {
      throw BadRequestDomainException.create(
        JOURNAL_ACCESS_ERRORS.SPORT_TYPE_MISMATCH,
      );
    }

    const existingAccess = await this.prisma.journalAccess.findUnique({
      where: {
        coachProfileId_journalId: {
          coachProfileId,
          journalId,
        },
      },
    });

    if (existingAccess) {
      throw BadRequestDomainException.create(
        JOURNAL_ACCESS_ERRORS.ACCESS_ALREADY_EXISTS,
      );
    }

    const existingPendingRequest = await this.prisma.accessRequest.findFirst({
      where: {
        coachProfileId,
        journalId,
        status: 'PENDING',
      },
    });

    if (existingPendingRequest) {
      throw BadRequestDomainException.create(
        JOURNAL_ACCESS_ERRORS.REQUEST_ALREADY_EXISTS,
      );
    }

    const request = await this.prisma.accessRequest.create({
      data: {
        journalId,
        coachProfileId,
      },
    });

    return { id: request.id };
  }
}
