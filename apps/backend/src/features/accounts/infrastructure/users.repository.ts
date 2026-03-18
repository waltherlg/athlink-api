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
