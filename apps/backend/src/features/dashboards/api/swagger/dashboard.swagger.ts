import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../../core/exceptions/domain-exceptions';
import { SwaggerHelper } from '../../../../core/helpers/swagger.helper';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';
import { AthleteDashboardDataViewDto } from '../dto/dashboard-api.dto';

export const SW_DASHBOARD_TITLES = {
  DASHBOARD_CONTROLLER: 'Dashboard operations',
};

export function GetAthleteDashboardSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiOperation({ summary: 'Get athlete dashboard' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns athlete dashboard data',
      type: AthleteDashboardDataViewDto,
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
