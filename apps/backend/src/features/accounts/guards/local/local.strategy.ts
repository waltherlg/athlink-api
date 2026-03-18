import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import { AuthService } from '../../application/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    const id = await this.authService.checkUserCredential(email, password);
    if (!id) {
      throw UnauthorizedDomainException.create(
        'The email or password are incorrect. Try again please',
        'emailOrPassword',
      );
    }
    return { id };
  }
}
