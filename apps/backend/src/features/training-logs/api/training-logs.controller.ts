import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { CreateTrainingLogInputDto } from './dto/training-log.dto';
import { trainingLogsPaths } from '@shared-types';
import { CreateTrainingLogCommand } from '../application/use-cases/create-training-log.use-case';

@Controller(trainingLogsPaths.trainigLog.controller)
export class TrainingLogsController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrainingLog(
    @Req() request: RequestWithUser,
    @Body() dto: CreateTrainingLogInputDto,
  ) {
    const athleteId = request.user.id;
    const sportType = dto.sportType;
    const result = await this.commandBus.execute(
      new CreateTrainingLogCommand({ athleteId, sportType }),
    );
    return result;
  }
}
