import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import {
  accessAndRefreshTokenDto,
  JwtPayloadDto,
} from '../../dto/domain-auth.dto';
import { TokenService } from '../../services/token.service';
import { CreateSessionDto } from '../../dto/domain-session.dto';
import { CryptoService } from '../../services/crypto.service';
import { SessionsRepository } from '../../../infrastructure/sessions.repository';

export class LoginCommand {
  constructor(
    public userId: string,
    public userAgent: string,
    public ip: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly cryptoService: CryptoService,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(command: LoginCommand): Promise<accessAndRefreshTokenDto> {
    const { userId, userAgent, ip } = command;

    const sessionId = randomUUID();

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      userId,
      sessionId,
    );

    const payload: JwtPayloadDto =
      this.tokenService.decodeRefreshToken(refreshToken);

    const refreshTokenHash = await this.cryptoService.hash(refreshToken);

    const createSessionDto: CreateSessionDto = {
      id: sessionId,
      userId,
      refreshTokenHash,
      ip,
      userAgent,
      expiresAt: new Date(payload.exp * 1000),
    };

    await this.sessionsRepository.create(createSessionDto);

    return { accessToken, refreshToken };
  }
}
