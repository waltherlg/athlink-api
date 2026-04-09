import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../../core/exceptions/domain-exceptions';
import { SwaggerHelper } from '../../../../core/helpers/swagger.helper';
import { COMMON_ERRORS } from '../../../../core/consts/validation.errors';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';
import {
  CreateTrainingRecordInputDto,
  TrainingRecordAthleteViewDto,
  TrainingRecordsPaginationViewDto,
} from '../dto/training-record.dto';
import { trainingJournalsPaths } from '@shared-types';
import { AUTH_ERRORS } from '../../../accounts/consts/auth.errors';

export const SW_TRAINING_RECORDS_TITLES = {
  TRAINING_RECORDS_CONTROLLER: 'Training record operations',
};

export function CreateTrainingRecordSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({
      summary: `Create training record (POST /${trainingJournalsPaths.controller}/${trainingJournalsPaths.byId}/${trainingJournalsPaths.records})`,
    }),
    ApiParam({
      name: 'trainingJournalId',
      description: 'Training journal id',
      required: true,
    }),
    ApiBody({
      description: 'Training record data',
      type: CreateTrainingRecordInputDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns created training record',
      type: TrainingRecordAthleteViewDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation and business errors',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          COMMON_ERRORS.VALIDATION_ERROR,
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
          AUTH_ERRORS.NOT_OWNER,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          AUTH_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiBearerAuth(),
  );
}

export function GetTrainingRecordsSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({
      summary: `Get training records (GET /${trainingJournalsPaths.controller}/${trainingJournalsPaths.byId}/${trainingJournalsPaths.records})`,
    }),
    ApiParam({
      name: 'trainingJournalId',
      description: 'Training journal id',
      required: true,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortDirection',
      required: false,
      example: 'DESC',
    }),
    ApiQuery({
      name: 'pageNumber',
      required: false,
      example: '1',
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      example: '10',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns paginated training records',
      type: TrainingRecordsPaginationViewDto,
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
          AUTH_ERRORS.NOT_OWNER,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          AUTH_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiBearerAuth(),
  );
}

export function GetTrainingRecordByIdSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({
      summary: `Get training record (GET /${trainingJournalsPaths.controller}/${trainingJournalsPaths.byId}/${trainingJournalsPaths.records}/:recordId)`,
    }),
    ApiParam({
      name: 'trainingJournalId',
      description: 'Training journal id',
      required: true,
    }),
    ApiParam({
      name: 'recordId',
      description: 'Training record id',
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns training record',
      type: TrainingRecordAthleteViewDto,
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
          AUTH_ERRORS.NOT_OWNER,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          AUTH_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiBearerAuth(),
  );
}
