import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { Entry, Prisma, TrainingLog } from '@prisma/client';
import {
  CreateEntryDto,
  CreateTrainingLogDto,
} from '../application/dto/domain-training-log.dto';

@Injectable()
export class TrainingLogsRepository {
  constructor(private prisma: PrismaService) {}

  async createTrainingLog(dto: CreateTrainingLogDto): Promise<TrainingLog> {
    const createdTrainingLog = await this.prisma.trainingLog.create({
      data: { ...dto },
    });
    return createdTrainingLog;
  }

  async createEntry(dto: CreateEntryDto): Promise<Entry> {
    const createdEntry = await this.prisma.entry.create({
      data: { ...dto },
    });
    return createdEntry;
  }

  async updateEntry(
    entryId: string,
    dateToUpdate: Prisma.EntryUpdateInput,
  ): Promise<Entry> {
    const updatedEntryEntry = await this.prisma.entry.update({
      where: { id: entryId },
      data: { ...dateToUpdate },
    });
    return updatedEntryEntry;
  }
}
