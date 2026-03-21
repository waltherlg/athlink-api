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

export enum SportTypeEnum {
  SHOOTING = 'SHOOTING',
}
