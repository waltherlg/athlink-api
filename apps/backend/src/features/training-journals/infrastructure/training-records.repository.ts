import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { Prisma, TrainingRecord } from '@prisma/client';
import { CreateTrainingRecordDto } from '../application/dto/domain-training-journal.dto';

@Injectable()
export class TrainingRecordsRepository {
  constructor(private prisma: PrismaService) {}
  async createTrainingRecord(
    dto: CreateTrainingRecordDto,
  ): Promise<TrainingRecord> {
    const createdTrainingRecord = await this.prisma.trainingRecord.create({
      data: { ...dto },
    });
    return createdTrainingRecord;
  }

  async updateTrainingRecord(
    recordId: string,
    dataToUpdate: Prisma.TrainingRecordUpdateInput,
  ): Promise<TrainingRecord> {
    const updatedTrainingRecord = await this.prisma.trainingRecord.update({
      where: { id: recordId },
      data: { ...dataToUpdate },
    });
    return updatedTrainingRecord;
  }

  async getTrainingRecordById(
    recordId: string,
  ): Promise<TrainingRecord | null> {
    const record = await this.prisma.trainingRecord.findUnique({
      where: { id: recordId },
    });
    if (!record) return null;
    return record;
  }

  async getLatestRecordsByTrainingJournalIds(
    journalIds: string[],
  ): Promise<TrainingRecord[]> {
    if (journalIds.length === 0) return [];
    const records = await this.prisma.trainingRecord.findMany({
      where: { trainingJournalId: { in: journalIds } },
      orderBy: { createdAt: 'desc' },
    });
    return records;
  }

  async getTrainingJournalIdsWithRecordsInRange(
    journalIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<string[]> {
    if (journalIds.length === 0) return [];
    const records = await this.prisma.trainingRecord.findMany({
      where: {
        trainingJournalId: { in: journalIds },
        createdAt: { gte: startDate, lt: endDate },
      },
      select: { trainingJournalId: true },
      distinct: ['trainingJournalId'],
    });
    return records.map((record) => record.trainingJournalId);
  }
}


