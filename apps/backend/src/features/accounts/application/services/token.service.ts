import { Injectable } from '@nestjs/common';
import {
  accessAndRefreshTokenDto,
  JwtPayloadDto,
} from '../dto/domain-auth.dto';
import { UserEnvironmentConfig } from '../../config/user-env.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userConfig: UserEnvironmentConfig,
  ) {}

  async createTokens(
    userId: string,
    sessionId: string,
  ): Promise<accessAndRefreshTokenDto> {
    const accessToken = await this.jwtService.signAsync(
      { id: userId },
      {
        expiresIn: this.userConfig.accessTokenExpiresIn,
        secret: this.userConfig.accessTokenSecret,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: userId, sessionId },
      {
        expiresIn: this.userConfig.refreshTokenExpiresIn,
        secret: this.userConfig.refreshTokenSecret,
      },
    );

    return { accessToken, refreshToken };
  }

  decodeRefreshToken(token: string): JwtPayloadDto {
    return this.jwtService.decode(token);
  }

  async verifyRefreshToken(token: string): Promise<JwtPayloadDto> {
    return this.jwtService.verifyAsync(token, {
      secret: this.userConfig.refreshTokenSecret,
    });
  }
}
