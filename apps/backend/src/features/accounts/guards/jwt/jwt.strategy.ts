import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEnvironmentConfig } from '../../config/user-env.config';
import { JwtPayloadDto } from '../../api/dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private userConfig: UserEnvironmentConfig) {
    const secret = userConfig.accessTokenSecret;
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
