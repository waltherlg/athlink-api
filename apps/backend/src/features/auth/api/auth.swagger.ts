import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRegistrationInputDto } from './dto/registration.dto';
import { UserViewDto } from '../../users/application/dto/user-view.dto';

export function RegisterUserSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Register new user' }),
    ApiBody({
      description: 'User data',
      type: UserRegistrationInputDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Returns created user',
      type: UserViewDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Data validation failed',
      //type: ErrorResponse,
    }),
  );
}
