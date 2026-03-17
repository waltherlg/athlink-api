import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEnvironmentConfig } from '../../config/user-env.config';
import { JwtPayloadDto } from '../../application/dto/domain-auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private envConfig: UserEnvironmentConfig) {
    const secret = envConfig.accessTokenSecret;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<JwtPayloadDto | null> {
    return payload;
  }
}
