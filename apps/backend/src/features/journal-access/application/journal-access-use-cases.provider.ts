import { AcceptAccessRequestUseCase } from './use-cases/accept-access-request.use-case';
import { CreateAccessRequestUseCase } from './use-cases/create-access-request.use-case';
import { DeleteJournalAccessUseCase } from './use-cases/delete-journal-access.use-case';
import { RejectAccessRequestUseCase } from './use-cases/reject-access-request.use-case';

export const JournalAccessUseCases = [
  AcceptAccessRequestUseCase,
  CreateAccessRequestUseCase,
  DeleteJournalAccessUseCase,
  RejectAccessRequestUseCase,
];
