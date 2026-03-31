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
}


