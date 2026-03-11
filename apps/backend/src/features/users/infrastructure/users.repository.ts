import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { UserCreateDto } from '../application/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: UserCreateDto): Promise<User> {
    const result = await this.prisma.user.create({ data: { ...dto } });
    return result;
  }
}
