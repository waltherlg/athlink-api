import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';
import {
  accessAndRefreshTokenDto,
  JwtPayloadDto,
} from '../../dto/domain-auth.dto';
import { TokenService } from '../../services/token.service';
import { SessionsRepository } from '../../../infrastructure/sessions.repository';
import { SESSION_ERRORS } from '../../../consts/session-errors.consts';
import { CryptoService } from '../../services/crypto.service';
import { UpdateSessionDto } from '../../dto/domain-session.dto';

export class RefreshTokenCommand {
  constructor(public tokenData: JwtPayloadDto) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionsRepo: SessionsRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute({
    tokenData,
  }: RefreshTokenCommand): Promise<accessAndRefreshTokenDto> {
    const foundSession = await this.sessionsRepo.findOne(tokenData.sessionId);

    if (!foundSession) {
      throw NotFoundDomainException.create(SESSION_ERRORS.SESSION_NOT_FOUND);
    }

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      tokenData.userId,
      tokenData.sessionId,
    );

    const payload = this.tokenService.decodeRefreshToken(refreshToken) as {
      exp: number;
    };

    const refreshTokenHash = await this.cryptoService.hash(refreshToken);
    const expiresAt = new Date(payload.exp * 1000);

    const updateDto: UpdateSessionDto = {
      refreshTokenHash,
      expiresAt,
      lastActiveAt: new Date(),
    };

    await this.sessionsRepo.update(tokenData.sessionId, updateDto);

    return { accessToken, refreshToken };
  }
}
