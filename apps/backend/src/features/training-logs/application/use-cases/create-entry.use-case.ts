import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEntryDto } from '../dto/domain-training-log.dto';
import { TrainingEntriesRepository } from '../../infrastructure/training-entries.repository';

export class CreateEntryCommand {
  constructor(public dto: CreateEntryDto) {}
}

@CommandHandler(CreateEntryCommand)
export class CreateEntryUseCase implements ICommandHandler<CreateEntryCommand> {
  constructor(private entriesRepo: TrainingEntriesRepository) {}

  async execute(command: CreateEntryCommand): Promise<any> {}
}
