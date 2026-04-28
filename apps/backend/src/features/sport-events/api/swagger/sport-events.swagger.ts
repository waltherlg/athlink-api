import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../../core/exceptions/domain-exceptions';
import { SwaggerHelper } from '../../../../core/helpers/swagger.helper';
import { COMMON_ERRORS } from '../../../../core/consts/validation.errors';
import { AUTH_ERRORS } from '../../../accounts/consts/auth.errors';
import { sportEventPaths } from '@shared-types';
import { SportTypeEnum } from '@shared-types';
import { SportEventViewDto } from '../dto/sport-event.dto';

export const SW_SPORT_EVENTS_TITLES = {
  SPORT_EVENT_CONTROLLER: 'Sport event operations',
};

export function GetSportEventsSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({
      summary: `Get sport events by sport type (GET /${sportEventPaths.controller}?sportType=...)`,
    }),
    ApiQuery({
      name: 'sportType',
      required: true,
      enum: SportTypeEnum,
      example: SportTypeEnum.SHOOTING_RIFLE_PISTOL,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns sport events',
      type: SportEventViewDto,
      isArray: true,
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
