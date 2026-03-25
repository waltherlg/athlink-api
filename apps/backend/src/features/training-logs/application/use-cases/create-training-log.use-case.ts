import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTrainingLogDto } from '../dto/domain-training-log.dto';
import { TrainingLogsRepository } from '../../infrastructure/training-logs.repository';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_LOG_ERRORS } from '../../consts/training-log-errors.consts';

export class CreateTrainingLogCommand {
  constructor(public dto: CreateTrainingLogDto) {}
}

@CommandHandler(CreateTrainingLogCommand)
export class CreateTrainingLogUseCase implements ICommandHandler<CreateTrainingLogCommand> {
  constructor(private trainigLogRepo: TrainingLogsRepository) {}

  async execute(command: CreateTrainingLogCommand): Promise<string> {
    const { athleteId, sportType } = command.dto;
    if (await this.trainigLogRepo.isTrainingLogExist(athleteId, sportType)) {
      throw BadRequestDomainException.create(
        TRAINING_LOG_ERRORS.TRAINING_LOG_ALREADY_EXISTS,
      );
    }
    const createdLog = await this.trainigLogRepo.createTrainingLog(command.dto);
    return createdLog.id;
  }
}
