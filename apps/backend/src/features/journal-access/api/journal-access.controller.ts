import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateJournalAccessRequestInput,
  journalAccessPaths,
} from '@shared-types';
import { RequestWithUser } from '../../accounts/guards/decorators/rt-payload-from-req.deocrator';
import { JwtAuthGuard } from '../../accounts/guards/jwt/jwt-auth.guard';
import { AcceptAccessRequestCommand } from '../application/use-cases/accept-access-request.use-case';
import { CreateAccessRequestCommand } from '../application/use-cases/create-access-request.use-case';
import { RejectAccessRequestCommand } from '../application/use-cases/reject-access-request.use-case';
import { CountIncomingAccessRequestsQuery } from '../application/query-handlers/count-incoming-access-requests.query-handler';
import { GetIncomingAccessRequestsQuery } from '../application/query-handlers/get-incoming-access-requests.query-handler';

@Controller(journalAccessPaths.controller)
export class JournalAccessController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(journalAccessPaths.requests)
  async createRequest(
    @Req() request: RequestWithUser,
    @Body() dto: CreateJournalAccessRequestInput,
  ) {
    const athleteId = request.user.userId;
    return this.commandBus.execute(
      new CreateAccessRequestCommand(
        athleteId,
        dto.journalId,
        dto.coachProfileId,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(journalAccessPaths.incomingRequests)
  async getIncomingRequests(@Req() request: RequestWithUser) {
    const coachUserId = request.user.userId;
    return this.queryBus.execute(
      new GetIncomingAccessRequestsQuery(coachUserId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(journalAccessPaths.incomingRequestsCount)
  async countIncomingRequests(@Req() request: RequestWithUser) {
    const coachUserId = request.user.userId;
    return this.queryBus.execute(
      new CountIncomingAccessRequestsQuery(coachUserId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(journalAccessPaths.acceptRequest)
  async acceptRequest(
    @Req() request: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    const coachUserId = request.user.userId;
    return this.commandBus.execute(
      new AcceptAccessRequestCommand(requestId, coachUserId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(journalAccessPaths.rejectRequest)
  async rejectRequest(
    @Req() request: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    const coachUserId = request.user.userId;
    return this.commandBus.execute(
      new RejectAccessRequestCommand(requestId, coachUserId),
    );
  }
}
