import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import { CoreEnvironmentConfig } from '../../../../core/config/core-env.config';
import { UserEnvironmentConfig } from '../../config/user-env.config';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { SESSION_CONSTS } from '../../consts/session.consts';
import { JwtPayloadDto } from '../../application/dto/domain-auth.dto';
import { SESSION_ERRORS } from '../../consts/session-errors.consts';
import { AUTH_ERRORS } from '../../consts/auth.errors';
import { CryptoService } from '../../application/services/crypto.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private envConfig: UserEnvironmentConfig,
    private sessionsAdapter: SessionsRepository,
    private cryptoService: CryptoService,
  ) {
    const secret = envConfig.refreshTokenSecret;
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: secret,
      jwtFromRequest: (req: Request) => {
        if (req && req.cookies) {
          return req.cookies[SESSION_CONSTS.REFRESH_TOKEN_NAME];
        }
        return null;
      },
    });
  }

  async validate(req: Request, payload: JwtPayloadDto) {
    const refreshToken = req.cookies[SESSION_CONSTS.REFRESH_TOKEN_NAME];

    if (!refreshToken) {
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    const session = await this.sessionsAdapter.findOne(payload.deviceId);

    if (!session) {
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    if (session.userId !== payload.id) {
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    if (session.expiresAt < new Date()) {
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    const isValid = await this.cryptoService.verify(
      session.refreshTokenHash,
      refreshToken,
    );

    if (!isValid) {
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    return payload;
  }
}
