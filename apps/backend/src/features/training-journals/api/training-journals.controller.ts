import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { CreateTrainingJournalInputDto } from './dto/training-journal.dto';
import { trainingJournalsPaths } from '@shared-types';
import { CreateTrainingJournalCommand } from '../application/use-cases/create-training-journal.use-case';
import { CreateTrainingJournalSwagger } from './swagger/training-journals.swagger';

@Controller(trainingJournalsPaths.controller)
export class TrainingJournalsController {
  constructor(private commandBus: CommandBus) {}

  @CreateTrainingJournalSwagger()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrainingJournal(
    @Req() request: RequestWithUser,
    @Body() dto: CreateTrainingJournalInputDto,
  ) {
    const athleteId = request.user.id;
    const sportType = dto.sportType;
    const result = await this.commandBus.execute(
      new CreateTrainingJournalCommand({ athleteId, sportType }),
    );
    return result;
  }
}

