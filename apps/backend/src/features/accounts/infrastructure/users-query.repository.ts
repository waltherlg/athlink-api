import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { UserCreateDto } from '../application/dto/domain-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersQueryRepository {
  constructor(private prisma: PrismaService) {}

  async getUserNameById(userId: string): Promise<string | null> {
    console.log('айдишка в гет май юзернейм ', userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    return user.userName;
  }
}
