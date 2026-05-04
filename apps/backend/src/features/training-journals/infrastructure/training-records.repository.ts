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
      data: {
        journalId: dto.trainingJournalId,
        eventId: dto.eventId,
        type: dto.type,
        result: dto.result,
        coachNotes: dto.coachNotes,
        privateNotes: dto.privateNotes,
      },
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
      where: { journalId: { in: journalIds } },
      orderBy: { createdAt: 'desc' },
    });
    return records;
  }

  async getLatestRecordsByTrainingJournalId(
    journalId: string,
    take: number,
  ): Promise<TrainingRecord[]> {
    const records = await this.prisma.trainingRecord.findMany({
      where: { journalId },
      orderBy: { createdAt: 'desc' },
      take,
    });
    return records;
  }

  async getTrainingRecordsByTrainingJournalId(
    journalId: string,
    params: {
      sortBy: keyof TrainingRecord;
      sortDirection: Prisma.SortOrder;
      skip: number;
      take: number;
    },
  ): Promise<{ items: TrainingRecord[]; totalCount: number }> {
    const { sortBy, sortDirection, skip, take } = params;
    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.trainingRecord.findMany({
        where: { journalId },
        orderBy: { [sortBy]: sortDirection },
        skip,
        take,
      }),
      this.prisma.trainingRecord.count({
        where: { journalId },
      }),
    ]);
    return { items, totalCount };
  }

  async getTrainingJournalIdsWithRecordsInRange(
    journalIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<string[]> {
    if (journalIds.length === 0) return [];
    const records = await this.prisma.trainingRecord.findMany({
      where: {
        journalId: { in: journalIds },
        createdAt: { gte: startDate, lt: endDate },
      },
      select: { journalId: true },
      distinct: ['journalId'],
    });
    return records.map((record) => record.journalId);
  }
}
