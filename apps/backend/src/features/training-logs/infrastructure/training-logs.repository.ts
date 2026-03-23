import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { Entry, Prisma, TrainingLog } from '@prisma/client';
import {
  CreateEntryDto,
  CreateTrainingLogDto,
} from '../application/dto/domain-training-log.dto';
import { SportTypeEnum } from '@shared-types/dist';

@Injectable()
export class TrainingLogsRepository {
  constructor(private prisma: PrismaService) {}

  async createTrainingLog(dto: CreateTrainingLogDto): Promise<TrainingLog> {
    const createdTrainingLog = await this.prisma.trainingLog.create({
      data: { ...dto },
    });
    return createdTrainingLog;
  }

  async isTrainingLogExist(
    athleteId: string,
    sportType: SportTypeEnum,
  ): Promise<boolean> {
    const result = await this.prisma.trainingLog.count({
      where: { athleteId, sportType },
    });
    return result > 0;
  }

  async getAllTrainingLogsByAthleteId(
    athleteId: string,
  ): Promise<TrainingLog[]> {
    const logs = await this.prisma.trainingLog.findMany({
      where: { athleteId },
    });
    return logs;
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

  async getEntryById(entryId: string): Promise<Entry | null> {
    const entry = await this.prisma.entry.findUnique({
      where: { id: entryId },
    });
    if (!entry) return null;
    return entry;
  }
}
