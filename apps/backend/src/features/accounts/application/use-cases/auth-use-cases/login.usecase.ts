import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import {
  accessAndRefreshTokenDto,
  JwtPayloadDto,
} from '../../dto/domain-auth.dto';
import { TokenService } from '../../services/token.service';
import { SessionCreateDto } from '../../dto/domain-session.dto';

export class LoginCommand {
  constructor(public dto: SessionCreateDto) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(private readonly tokenService: TokenService) {}

  async execute(command: LoginCommand): Promise<accessAndRefreshTokenDto> {
    const { userId, userAgent, ip } = command.dto;

    const newDeviceId = randomUUID();
    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      userId,
      newDeviceId,
    );

    // const payload: JwtPayloadDto =
    //   this.tokenService.decodeRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }
}
