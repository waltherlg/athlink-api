import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { CreateTrainingLogInputDto } from './dto/training-log.dto';

@Controller()
export class TrainingLogsController {
  constructor(commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrainingLog(
    @Req() request: RequestWithUser,
    @Body() dto: CreateTrainingLogInputDto,
  ) {}
}
