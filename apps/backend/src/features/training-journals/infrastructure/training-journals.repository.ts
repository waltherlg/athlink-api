import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { TrainingJournal } from '@prisma/client';
import { CreateTrainingJournalDto } from '../application/dto/domain-training-journal.dto';
import { SportTypeEnum } from '@shared-types';

@Injectable()
export class TrainingJournalsRepository {
  constructor(private prisma: PrismaService) {}

  async createTrainingJournal(
    dto: CreateTrainingJournalDto,
  ): Promise<TrainingJournal> {
    const createdTrainingJournal = await this.prisma.trainingJournal.create({
      data: { ...dto },
    });
    return createdTrainingJournal;
  }

  async getTrainingJournalById(
    journalId: string,
  ): Promise<TrainingJournal | null> {
    const log = await this.prisma.trainingJournal.findUnique({
      where: { id: journalId },
    });
    return log ? log : null;
  }

  async isTrainingJournalExist(
    athleteId: string,
    sportType: SportTypeEnum,
  ): Promise<boolean> {
    const result = await this.prisma.trainingJournal.count({
      where: { athleteId, sportType },
    });
    return result > 0;
  }

  async getAllTrainingJournalsByAthleteId(
    athleteId: string,
  ): Promise<TrainingJournal[]> {
    const logs = await this.prisma.trainingJournal.findMany({
      where: { athleteId },
    });
    return logs;
  }
}

