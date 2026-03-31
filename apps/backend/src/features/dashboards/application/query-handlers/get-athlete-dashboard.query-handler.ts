import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AthleteDashboardDataViewDto } from '../../api/dto/dashboard-api.dto';

export class GetAthleteDesboardQuery {
  constructor(public athleteId: string) {}
}

@QueryHandler(GetAthleteDesboardQuery)
export class GetAthleteDesboardQueryHandler implements IQueryHandler<GetAthleteDesboardQuery> {
  execute(
    query: GetAthleteDesboardQuery,
  ): Promise<AthleteDashboardDataViewDto> {
    throw new Error('Method not implemented.');
  }
}
