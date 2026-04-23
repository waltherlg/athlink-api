import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateTrainingRecordInputDto } from '../dto/training-record.dto';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_RECORD_ERRORS } from '../../consts/training-record-errors.consts';
import {
  TrainingRecordErrorCodeEnum,
  TrainingRecordTypeEnum,
} from '@shared-types/dist';

@Injectable()
export class CreateTrainingRecordValidationPipe implements PipeTransform {
  transform(dto: CreateTrainingRecordInputDto) {
    if (dto.type === TrainingRecordTypeEnum.STRUCTURED) {
      if (!dto.eventId)
        throw BadRequestDomainException.create(
          TRAINING_RECORD_ERRORS.EVENT_REQUIRED,
        );
      if (dto.result == null)
        throw BadRequestDomainException.create(
          TRAINING_RECORD_ERRORS.RESULT_REQUIRED,
        );
    }

    if (dto.type === 'FREE') {
      if (dto.result != null) {
        throw BadRequestDomainException.create(
          TRAINING_RECORD_ERRORS.RESULT_NOT_ALLOWED,
        );
      }
    }

    return dto;
  }
}
