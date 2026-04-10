import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async checkUserCredential(
    loginOrEmail: string,
    password: string,
  ): Promise<User | null> {
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const isPasswordValid = await this.cryptoService.verify(
      user.passwordHash,
      password,
    );

    if (!isPasswordValid) return null;

    return user;
  }
}
