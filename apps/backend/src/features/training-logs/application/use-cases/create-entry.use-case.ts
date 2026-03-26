import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEntryDto } from '../dto/domain-training-log.dto';
import { TrainingEntriesRepository } from '../../infrastructure/training-entries.repository';
import { TrainingLogsRepository } from '../../infrastructure/training-logs.repository';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_LOG_ERRORS } from '../../consts/training-log-errors.consts';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';

export class CreateEntryCommand {
  constructor(
    public userId: string,
    public dto: CreateEntryDto,
  ) {}
}

@CommandHandler(CreateEntryCommand)
export class CreateEntryUseCase implements ICommandHandler<CreateEntryCommand> {
  constructor(
    private entriesRepo: TrainingEntriesRepository,
    private logsRepo: TrainingLogsRepository,
  ) {}

  async execute(command: CreateEntryCommand): Promise<any> {
    const trainingLog = await this.logsRepo.getTrainingLogById(
      command.dto.trainingLogId,
    );

    if (!trainingLog)
      throw NotFoundDomainException.create(
        TRAINING_LOG_ERRORS.TRAINING_LOG_NOT_FOUND,
      );

    if (trainingLog.athleteId !== command.userId)
      throw ForbiddenDomainException.create(ACCOUNT_ERRORS.NOT_OWNER);

    const createdEntry = await this.entriesRepo.createEntry(command.dto);
    return createdEntry;
  }
}
