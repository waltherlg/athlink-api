import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { CreateTrainingJournalInputDto } from './dto/training-journal.dto';
import { trainingJournalsPaths } from '@shared-types';
import { CreateTrainingJournalCommand } from '../application/use-cases/create-training-journal.use-case';
import { CreateTrainingRecordCommand } from '../application/use-cases/create-training-record.use-case';
import {
  CreateTrainingRecordInputDto,
  TrainingRecordsQueryParamsDto,
} from './dto/training-record.dto';
import {
  CreateTrainingJournalSwagger,
  GetTrainingJournalByIdSwagger,
  GetTrainingJournalsSwagger,
  SW_TRAINING_JOURNALS_TITLES,
} from './swagger/training-journals.swagger';
import {
  CreateTrainingRecordSwagger,
  GetTrainingRecordByIdSwagger,
  GetTrainingRecordsSwagger,
} from './swagger/training-records.swagger';
import { GetTrainingJournalsQuery } from '../application/query-handlers/get-training-journals.query-handler';
import { GetTrainingJournalByIdQuery } from '../application/query-handlers/get-training-journal-by-id.query-handler';
import { GetTrainingRecordsByJournalIdQuery } from '../application/query-handlers/get-training-records-by-journal-id.query-handler';
import { GetTrainingRecordByIdQuery } from '../application/query-handlers/get-training-record-by-id.query-handler';

@ApiTags(SW_TRAINING_JOURNALS_TITLES.TRAINING_JOURNAL_CONTROLLER)
@Controller(trainingJournalsPaths.controller)
export class TrainingJournalsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @GetTrainingJournalsSwagger()
  @UseGuards(JwtAuthGuard)
  @Get(trainingJournalsPaths.list)
  async getTrainingJournals(@Req() request: RequestWithUser) {
    const athleteId = request.user.id;
    return this.queryBus.execute(new GetTrainingJournalsQuery(athleteId));
  }

  @GetTrainingJournalByIdSwagger()
  @UseGuards(JwtAuthGuard)
  @Get(trainingJournalsPaths.byId)
  async getTrainingJournalById(
    @Req() request: RequestWithUser,
    @Param('trainingJournalId') trainingJournalId: string,
  ) {
    const athleteId = request.user.id;
    return this.queryBus.execute(
      new GetTrainingJournalByIdQuery(athleteId, trainingJournalId),
    );
  }

  @GetTrainingRecordsSwagger()
  @UseGuards(JwtAuthGuard)
  @Get(`${trainingJournalsPaths.byId}/${trainingJournalsPaths.records}`)
  async getTrainingRecords(
    @Req() request: RequestWithUser,
    @Param('trainingJournalId') trainingJournalId: string,
    @Query() query: TrainingRecordsQueryParamsDto,
  ) {
    const athleteId = request.user.id;
    return this.queryBus.execute(
      new GetTrainingRecordsByJournalIdQuery(
        athleteId,
        trainingJournalId,
        query,
      ),
    );
  }

  @GetTrainingRecordByIdSwagger()
  @UseGuards(JwtAuthGuard)
  @Get(
    `${trainingJournalsPaths.byId}/${trainingJournalsPaths.records}/:recordId`,
  )
  async getTrainingRecordById(
    @Req() request: RequestWithUser,
    @Param('trainingJournalId') trainingJournalId: string,
    @Param('recordId') recordId: string,
  ) {
    const athleteId = request.user.id;
    return this.queryBus.execute(
      new GetTrainingRecordByIdQuery(athleteId, trainingJournalId, recordId),
    );
  }

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
  @Post(`${trainingJournalsPaths.byId}/${trainingJournalsPaths.records}`)
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
