import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ACCOUNTS_PATH_CONSTS } from '../consts/path.consts';
import { RequestWithUser } from '../guards/decorators/rt-payload-from-req.deocrator';
import type { Response } from 'express';
import { LoginCommand } from '../application/use-cases/auth-use-cases/login.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { SESSION_CONSTS } from '../consts/session.consts';
import { SessionCreateDto } from '../application/dto/domain-session.dto';
import { cookieSettings } from '../config/cookie.config';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt/jwt-auth.guard';

@Controller(ACCOUNTS_PATH_CONSTS.AUTHORIZATION_CONTROLLER)
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(LocalAuthGuard)
  @Post(ACCOUNTS_PATH_CONSTS.LOGIN)
  async login(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const userAgent: string =
      request.headers['user-agent'] || SESSION_CONSTS.USER_AGENT_DEFAULT;
    const ip: string = request.ip || SESSION_CONSTS.IP_DEFAULT;
    const userId = request.user.id;

    const dto: SessionCreateDto = { userId, userAgent, ip };

    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginCommand(dto),
    );

    response.cookie(
      SESSION_CONSTS.REFRESH_TOKEN_NAME,
      refreshToken,
      cookieSettings,
    );
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async jwtCheck() {
    return 'jwt passed';
  }
}
