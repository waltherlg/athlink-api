import { SportTypeEnum, TrainingRecordTypeEnum } from '@shared-types';

export class CreateTrainingJournalDto {
  athleteId: string;
  sportType: SportTypeEnum;
}

export class CreateTrainingRecordDto {
  trainingJournalId: string;
  type: TrainingRecordTypeEnum;
  eventId?: string;
  result?: number;
  coachNotes?: string;
  privateNotes?: string;
}

export class UpdateTrainingRecordDto {
  result?: number;
  coachNotes?: string;
  privateNotes?: string;
}
