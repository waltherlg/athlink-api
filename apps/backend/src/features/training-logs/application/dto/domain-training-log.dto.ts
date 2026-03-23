import { SportTypeEnum } from '@shared-types';

export class CreateTrainingLogDto {
  athleteId: string;
  sportType: SportTypeEnum;
}

export class CreateEntryDto {
  trainingLogId: string;
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
}

export class UpdateEntryDto {
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
}
