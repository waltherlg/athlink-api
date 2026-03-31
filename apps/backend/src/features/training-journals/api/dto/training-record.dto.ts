import { ApiProperty } from '@nestjs/swagger';
import {
  CreateTrainingRecordInput,
  TrainingRecordAthleteView,
} from '@shared-types';

export class CreateTrainingRecordInputDto implements CreateTrainingRecordInput {
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
}

export class TrainingRecordAthleteViewDto implements TrainingRecordAthleteView {
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  id: string;

  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  trainingJournalId: string;

  @ApiProperty({ example: '628.9', nullable: true })
  result: string | null;

  @ApiProperty({ example: 'Coach notes', nullable: true })
  coachNotes: string | null;

  @ApiProperty({ example: 'Private notes', nullable: true })
  privateNotes: string | null;

  @ApiProperty({ example: '2026-03-13T12:39:48.527Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-03-13T12:39:48.527Z' })
  updatedAt: string;
}

