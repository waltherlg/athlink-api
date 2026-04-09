import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserEnvironmentConfig } from '../../config/user-env.config';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { SESSION_CONSTS } from '../../consts/session.consts';
import { JwtPayloadDto } from '../../application/dto/domain-auth.dto';
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

    console.log('пейлод в jwt гварде ', payload);
    if (!refreshToken) {
      console.log('нет рефреш токена');
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    const session = await this.sessionsAdapter.findOne(payload.sessionId);

    if (!session) {
      console.log('не нашел сессию в бд');
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    if (session.userId !== payload.userId) {
      console.log('юзерайди в сессии и пейлоаде не совпали');
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    if (session.expiresAt < new Date()) {
      console.log('сессия в бд протухла');
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    const isValid = await this.cryptoService.verify(
      session.refreshTokenHash,
      refreshToken,
    );

    if (!isValid) {
      console.log('хеш сессии не валиден');
      throw UnauthorizedDomainException.create(AUTH_ERRORS.UNAUTHORIZED);
    }

    console.log(
      '---------------------- рефреш токен прошел ----------------------------',
    );

    return payload;
  }
}
