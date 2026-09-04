import { JournalAccessRoleEnum } from '@athlink/shared-types';

export class CreateJournalAccessRequestDto {
  journalId: string;
  coachProfileId: string;
}

export class CreateJournalAccesstDto {
  journalId: string;
  coachProfileId: string;
  role: JournalAccessRoleEnum;
}
