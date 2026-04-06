import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { UserCreateDto } from '../application/dto/domain-user.dto';
import { Session, User } from '@prisma/client';
import { SessionsRepositoryInterface } from './interfaces/sessions-repository.interface';
import {
  SessionDto,
  CreateSessionDto,
  UpdateSessionDto,
} from '../application/dto/domain-session.dto';

@Injectable()
export class SessionsRepository implements SessionsRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({ where: { id } });
    return session ? session : null;
  }

  async create(dto: CreateSessionDto): Promise<string> {
    const createdSession = await this.prisma.session.create({
      data: { ...dto },
    });
    return createdSession.id;
  }

  async update(sessionId: string, dto: UpdateSessionDto): Promise<boolean> {
    const result = await this.prisma.session.update({
      where: { id: sessionId },
      data: { ...dto },
    });
    return !!result;
  }

  async delete(userId: string, sessionId: string): Promise<boolean> {
    const result = await this.prisma.session.delete({
      where: { id: sessionId, userId },
    });
    return !!result;
  }

  async deleteAllExceptCurrent(id: string, userId: string): Promise<boolean> {
    const result = await this.prisma.session.deleteMany({
      where: { userId, id: { not: id } },
    });
    return result.count > 0;
  }
}
