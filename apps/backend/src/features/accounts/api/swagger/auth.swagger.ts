import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRegistrationInputDto } from '../dto/registration.dto';
import { UserViewDto } from '../dto/user-view.dto';
import { ErrorResponse } from '../../../../core/exceptions/domain-exceptions';
import { LoginResponseDto, LoginUserDto } from '../dto/auth.dto';
import { ACCOUNT_ERRORS } from '../../consts/account-errors.consts';
import { SwaggerHelper } from '../../../../core/helpers/swagger.helper';
import { COMMON_ERRORS } from '../../../../core/consts/validation.errors';
import { AUTH_ERRORS } from '../../consts/auth.errors';
import { SESSION_ERRORS } from '../../consts/session-errors.consts';

export const SW_AUTH_TITLES = {
  AUTH_CONTROLLER: 'Auth flow',
};

export function RegisterUserSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),

    ApiOperation({ summary: 'Register new user' }),
    ApiBody({
      description: 'User data',
      type: UserRegistrationInputDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Returns created user',
      type: UserViewDto,
    }),

    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation and business errors',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          ACCOUNT_ERRORS.EMAIL_ALREADY_EXITS,
          ACCOUNT_ERRORS.USER_NAME_ALREADY_EXITS,
          COMMON_ERRORS.VALIDATION_ERROR,
        ]),
      },
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
      status: HttpStatus.OK,
      description:
        'Successful login.\n\nBody: accessToken \n\nCookie: refreshToken (HttpOnly, Secure)',
      type: LoginResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'The email or password are incorrect',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          AUTH_ERRORS.EMAIL_OR_PASSWORD_INCORRECT,
        ]),
      },
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
  );
}

export function RefreshTokenSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Refresh access token',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description:
        'Successful refresh.\n\nBody: accessToken \n\nCookie: refreshToken (HttpOnly, Secure)',
      type: LoginResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          AUTH_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Session not found',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          SESSION_ERRORS.SESSION_NOT_FOUND,
        ]),
      },
    }),
  );
}

export function LogoutSwagger() {
  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Logout',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Successful logout',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User unauthorized',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          AUTH_ERRORS.UNAUTHORIZED,
        ]),
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Session not found',
      content: {
        'application/json': SwaggerHelper.buildErrorResponse([
          SESSION_ERRORS.SESSION_NOT_FOUND,
        ]),
      },
    }),
  );
}
