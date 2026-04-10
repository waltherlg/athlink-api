import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { UserCreateDto } from '../application/dto/domain-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: UserCreateDto): Promise<User> {
    const result = await this.prisma.user.create({ data: { ...dto } });
    return result;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ userName: loginOrEmail }, { email: loginOrEmail }],
      },
    });
    if (!user) return null;
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return user;
  }

  async findUserByConfirmationCode(code: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { confirmationCode: code },
    });
    if (!user) return null;
    return user;
  }

  async confirmUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isConfirmed: true,
        confirmationCode: null,
        confirmCodeExpiryDate: null,
      },
    });
  }

  async updateConfirmationData(
    userId: string,
    confirmationCode: string,
    confirmCodeExpiryDate: Date,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        confirmationCode,
        confirmCodeExpiryDate,
      },
    });
  }

  async updatePasswordRecoveryData(
    userId: string,
    recoveryCode: string,
    recoveryExpiresAt: Date,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordRecoveryCode: recoveryCode,
        passwordRecoveryExpiresAt: recoveryExpiresAt,
      },
    });
  }

  async findUserByEmailAndRecoveryCode(
    email: string,
    recoveryCode: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, passwordRecoveryCode: recoveryCode },
    });
    if (!user) return null;
    return user;
  }

  async updatePasswordByRecovery(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        passwordRecoveryCode: null,
        passwordRecoveryExpiresAt: null,
      },
    });
  }

  async isUserNameExist(userName: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { userName: userName },
    });
    return count > 0;
  }

  async isEmailExist(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email },
    });
    return count > 0;
  }
}
