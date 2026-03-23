import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller()
export class TrainingLogsController {
  constructor(commandBus: CommandBus) {}

  @Post()
  async createTrainingLog() {}
}
