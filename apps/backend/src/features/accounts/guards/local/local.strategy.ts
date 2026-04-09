import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import { AuthService } from '../../application/services/auth.service';
import { AUTH_ERRORS } from '../../consts/auth.errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    const userId = await this.authService.checkUserCredential(email, password);
    if (!userId) {
      throw UnauthorizedDomainException.create(
        AUTH_ERRORS.EMAIL_OR_PASSWORD_INCORRECT,
      );
    }
    return { userId };
  }
}
