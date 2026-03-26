import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  CreateTrainingLogInputDto,
  TrainingLogViewDto,
} from '../dto/training-log.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../../core/exceptions/domain-exceptions';
import { SwaggerHelper } from '../../../../core/helpers/swagger.helper';
import { COMMON_ERRORS } from '../../../../core/consts/validation.errors';
import { TRAINING_LOG_ERRORS } from '../../consts/training-log-errors.consts';

export const SW_TRAINING_LOGS_TITLES = {
  TRAINING_LOG_CONTROLLER: 'Training log operations',
};

export function CreateTrainingLogSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({ summary: 'Register new user' }),
    ApiBody({
      description: 'Training log data',
      type: CreateTrainingLogInputDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns created user',
      type: TrainingLogViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation and business errors',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          COMMON_ERRORS.VALIDATION_ERROR,
          TRAINING_LOG_ERRORS.TRAINING_LOG_ALREADY_EXISTS,
        ]),
      },
    }),
    ApiBearerAuth(),
  );
}
