import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { Entry, Prisma } from '@prisma/client';
import { CreateEntryDto } from '../application/dto/domain-training-log.dto';

@Injectable()
export class TrainingEntriesRepository {
  constructor(private prisma: PrismaService) {}
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
