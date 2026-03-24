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
import { UserRegistrationInputDto } from '../dto/registration.dto';
import { UserViewDto } from '../dto/user-view.dto';
import { ErrorResponse } from '../../../../core/exceptions/domain-exceptions';
import { LoginResponseDto, LoginUserDto } from '../dto/auth.dto';
import { buildErrorExamples } from '../../../../core/helpers/swagger.helper';
import { ACCOUNT_ERRORS } from '../../consts/account-errors.consts';

export const SW_AUTH_TITLES = {
  AUTH_CONTROLLER: 'Auth flow',
};

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
      description: 'Business errors',
      content: {
        'application/json': {
          examples: buildErrorExamples([
            ACCOUNT_ERRORS.EMAIL_ALREADY_EXITS,
            ACCOUNT_ERRORS.USER_NAME_ALREADY_EXITS,
          ]),
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Data validation failed',
      type: ErrorResponse,
    }),
  );
}

export function LoginSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
    }),
    ApiBody({
      description: 'User data',
      type: LoginUserDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'The email or password are incorrect',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description:
        'Successful login.\n\nBody: accessToken \n\nCookie: refreshToken (HttpOnly, Secure)',
      type: LoginResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'The email or password are incorrect',
      type: ErrorResponse,
    }),
  );
}
