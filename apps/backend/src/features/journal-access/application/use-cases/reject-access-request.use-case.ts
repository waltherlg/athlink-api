import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestDomainException,
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { PrismaService } from '../../../../core/database/prisma/prisma.service';
import { JOURNAL_ACCESS_ERRORS } from '../../consts/coaches-errors.consts';

export class RejectAccessRequestCommand {
  constructor(
    public requestId: string,
    public coachUserId: string,
  ) {}
}

@CommandHandler(RejectAccessRequestCommand)
export class RejectAccessRequestUseCase implements ICommandHandler<RejectAccessRequestCommand> {
  constructor(private prisma: PrismaService) {}

  async execute(command: RejectAccessRequestCommand): Promise<void> {
    const request = await this.prisma.accessRequest.findUnique({
      where: { id: command.requestId },
      include: { coachProfile: true },
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

    if (request.coachProfile.userId !== command.coachUserId) {
      throw ForbiddenDomainException.create(JOURNAL_ACCESS_ERRORS.NOT_OWNER);
    }

    await this.prisma.accessRequest.update({
      where: { id: request.id },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
      },
    });
  }
}
