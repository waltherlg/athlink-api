import { CreateTrainingEntryInput } from '@shared-types/dist';

export class CreateTrainingEntryInputDto implements CreateTrainingEntryInput {
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
}
