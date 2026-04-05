import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '../guards/decorators/rt-payload-from-req.deocrator';
import type { Response } from 'express';
import { LoginCommand } from '../application/use-cases/auth-use-cases/login.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { SESSION_CONSTS } from '../consts/session.consts';
import { cookieSettings } from '../config/cookie.config';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { UserRegistrationCommand } from '../application/use-cases/auth-use-cases/user-registration.use-case';
import { UserRegistrationInputDto } from './dto/registration.dto';
import { UserViewDto } from './dto/user-view.dto';
import {
  LoginSwagger,
  RegisterUserSwagger,
  SW_AUTH_TITLES,
} from './swagger/auth.swagger';
import { authPaths } from '@shared-types';

@ApiTags(SW_AUTH_TITLES.AUTH_CONTROLLER)
@Controller(authPaths.controller)
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @RegisterUserSwagger()
  @Post(authPaths.registration)
  async registerUser(@Body() dto: UserRegistrationInputDto) {
    const createdUser: UserViewDto = await this.commandBus.execute(
      new UserRegistrationCommand(dto),
    );
    return createdUser;
  }

  @LoginSwagger()
  @UseGuards(LocalAuthGuard)
  @Post(authPaths.login)
  async login(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const userAgent: string =
      request.headers['user-agent'] || SESSION_CONSTS.USER_AGENT_DEFAULT;
    const ip: string = request.ip || SESSION_CONSTS.IP_DEFAULT;
    const userId = request.user.id;

    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginCommand(userId, userAgent, ip),
    );

    response.cookie(
      SESSION_CONSTS.REFRESH_TOKEN_NAME,
      refreshToken,
      cookieSettings,
    );
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get(authPaths.me)
  async getMayUserName(@Req() request: RequestWithUser) {
    return await this.usersQueryRepository.getUserNameById(request.user.id);
  }
}
