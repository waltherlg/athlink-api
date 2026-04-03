import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { UserCreateDto } from '../application/dto/domain-user.dto';
import { User } from '@prisma/client';
import { SessionsRepositoryInterface } from './interfaces/sessions-repository.interface';
import {
  SessionDto,
  SessionCreateDto,
} from '../application/dto/domain-session.dto';

@Injectable()
export class SessionsRepository implements SessionsRepositoryInterface {
  constructor(private prisma: PrismaService) {}
  findOne(deviceId: string): Promise<SessionDto | null> {
    throw new Error('Method not implemented.');
  }
  create(dto: SessionCreateDto): Promise<string> {
    throw new Error('Method not implemented.');
  }
  delete(deviceId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  deleteAllExceptCurrent(deviceId: string, userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async createUser(dto: UserCreateDto): Promise<User> {
    const result = await this.prisma.user.create({ data: { ...dto } });
    return result;
  }
}
