import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { CreateTrainingJournalInputDto } from './dto/training-journal.dto';
import { trainingJournalsPaths } from '@shared-types';
import { CreateTrainingJournalCommand } from '../application/use-cases/create-training-journal.use-case';
import { CreateTrainingRecordCommand } from '../application/use-cases/create-training-record.use-case';
import { CreateTrainingRecordInputDto } from './dto/training-record.dto';
import {
  CreateTrainingJournalSwagger,
  SW_TRAINING_JOURNALS_TITLES,
} from './swagger/training-journals.swagger';
import { CreateTrainingRecordSwagger } from './swagger/training-records.swagger';

@ApiTags(SW_TRAINING_JOURNALS_TITLES.TRAINING_JOURNAL_CONTROLLER)
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

  @CreateTrainingRecordSwagger()
  @UseGuards(JwtAuthGuard)
  @Post(trainingJournalsPaths.records)
  async createTrainingRecord(
    @Req() request: RequestWithUser,
    @Param('trainingJournalId') trainingJournalId: string,
    @Body() dto: CreateTrainingRecordInputDto,
  ) {
    const userId = request.user.id;
    const result = await this.commandBus.execute(
      new CreateTrainingRecordCommand(userId, {
        trainingJournalId,
        result: dto.result,
        coachNotes: dto.coachNotes,
        privateNotes: dto.privateNotes,
      }),
    );
    return result;
  }
}

