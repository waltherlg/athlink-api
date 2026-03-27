import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import { AuthService } from '../../application/services/auth.service';
import { ACCOUNT_ERRORS } from '../../consts/account-errors.consts';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    const id = await this.authService.checkUserCredential(email, password);
    if (!id) {
      throw UnauthorizedDomainException.create(
        ACCOUNT_ERRORS.EMAIL_OR_PASSWORD_INCORRECT,
      );
    }
    return { id };
  }
}
