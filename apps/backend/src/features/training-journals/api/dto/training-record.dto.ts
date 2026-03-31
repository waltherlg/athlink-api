import { CreateTrainingRecordInput } from '@shared-types';

export class CreateTrainingRecordInputDto implements CreateTrainingRecordInput {
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
}

