import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTrainingRecordDto } from '../dto/domain-training-journal.dto';
import { TrainingRecordsRepository } from '../../infrastructure/training-records.repository';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';
import {
  ForbiddenDomainException,
  BadRequestDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';
import { AUTH_ERRORS } from '../../../accounts/consts/auth.errors';
import { TRAINING_RECORD_ERRORS } from '../../consts/training-record-errors.consts';
import { SportEventQueryRepository } from '../../../sport-events/infrastructure/sport-events.query.repository';
import { SportTypeEnum, TrainingRecordTypeEnum } from '@shared-types';

export class CreateTrainingRecordCommand {
  constructor(
    public userId: string,
    public dto: CreateTrainingRecordDto,
  ) {}
}

@CommandHandler(CreateTrainingRecordCommand)
export class CreateTrainingRecordUseCase implements ICommandHandler<CreateTrainingRecordCommand> {
  constructor(
    private trainingRecordsRepo: TrainingRecordsRepository,
    private journalsRepo: TrainingJournalsRepository,
    private sportEventsRepo: SportEventQueryRepository,
  ) {}

  async execute(command: CreateTrainingRecordCommand): Promise<any> {
    const trainingJournal = await this.journalsRepo.getTrainingJournalById(
      command.dto.trainingJournalId,
    );

    if (!trainingJournal)
      throw NotFoundDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
      );

    if (trainingJournal.athleteId !== command.userId)
      throw ForbiddenDomainException.create(AUTH_ERRORS.NOT_OWNER);

    if (command.dto.type === TrainingRecordTypeEnum.STRUCTURED) {
      const sportEvents = await this.sportEventsRepo.getEventsBySportType(
        trainingJournal.sportType as SportTypeEnum,
      );
      const selectedEvent = sportEvents.find(
        (event) => event.id === command.dto.eventId,
      );

      if (!selectedEvent) {
        throw BadRequestDomainException.create(
          TRAINING_RECORD_ERRORS.EVENT_INVALID,
        );
      }

      validateResultForEvent(command.dto.result, selectedEvent);
    }

    const createdRecord = await this.trainingRecordsRepo.createTrainingRecord(
      command.dto,
    );
    return createdRecord;
  }
}

function validateResultForEvent(
  result: number | undefined,
  event: { decimals: number | null; maxScore: number | null },
) {
  if (result == null || !Number.isFinite(result)) {
    throw BadRequestDomainException.create(TRAINING_RECORD_ERRORS.RESULT_INVALID);
  }

  const decimals = event.decimals ?? 0;
  const roundedResult = Number(result.toFixed(decimals));
  const hasTooManyDecimals = Math.abs(roundedResult - result) > 1e-9;

  if (hasTooManyDecimals) {
    throw BadRequestDomainException.create(TRAINING_RECORD_ERRORS.RESULT_INVALID);
  }

  if (event.maxScore != null && result > event.maxScore) {
    throw BadRequestDomainException.create(TRAINING_RECORD_ERRORS.RESULT_INVALID);
  }
}
