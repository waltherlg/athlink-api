import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  CreateTrainingJournalInputDto,
  TrainingJournalViewDto,
  TrainingJournalWithLatestRecordsViewDto,
} from '../dto/training-journal.dto';
import { CreateTrainingRecordInputDto } from '../dto/training-record.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../../core/exceptions/domain-exceptions';
import { SwaggerHelper } from '../../../../core/helpers/swagger.helper';
import { COMMON_ERRORS } from '../../../../core/consts/validation.errors';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';

export const SW_TRAINING_JOURNALS_TITLES = {
  TRAINING_JOURNAL_CONTROLLER: 'Training journal operations',
};

export function CreateTrainingJournalSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({ summary: 'Create training journal' }),
    ApiBody({
      description: 'Training journal data',
      type: CreateTrainingJournalInputDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          ACCOUNT_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns created training journal',
      type: TrainingJournalViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation and business errors',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          COMMON_ERRORS.VALIDATION_ERROR,
          TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_ALREADY_EXISTS,
        ]),
      },
    }),
    ApiBearerAuth(),
  );
}

export function GetTrainingJournalsSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({ summary: 'Get all training journals of current user' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns training journals',
      type: TrainingJournalViewDto,
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          ACCOUNT_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiBearerAuth(),
  );
}

export function GetTrainingJournalByIdSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({ summary: 'Get training journal by id with last 3 records' }),
    ApiParam({
      name: 'trainingJournalId',
      description: 'Training journal id',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns training journal',
      type: TrainingJournalWithLatestRecordsViewDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Training journal not found',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'training journal does not belong to the current user',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          ACCOUNT_ERRORS.NOT_OWNER,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          ACCOUNT_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiBearerAuth(),
  );
}

export function CreateTrainingRecordSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({ summary: 'Create training record' }),
    ApiBody({
      description: 'Training record data',
      type: CreateTrainingRecordInputDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns created training record',
      type: TrainingJournalViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation and business errors',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          COMMON_ERRORS.VALIDATION_ERROR,
          TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_ALREADY_EXISTS,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Training journal not found',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'training journal does not belong to the current user',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          ACCOUNT_ERRORS.NOT_OWNER,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          ACCOUNT_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiBearerAuth(),
  );
}

