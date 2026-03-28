import { SportTypeEnum } from '@shared-types';

export class CreateTrainingJournalDto {
  athleteId: string;
  sportType: SportTypeEnum;
}

export class CreateTrainingRecordDto {
  trainingJournalId: string;
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
}

export class UpdateTrainingRecordDto {
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
}

