import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SportTypeEnum } from '@shared-types';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';

export class GetAvailableSportTypesQuery {
  constructor(public athleteId: string) {}
}

@QueryHandler(GetAvailableSportTypesQuery)
export class GetAvailableSportTypesQueryHandler
  implements IQueryHandler<GetAvailableSportTypesQuery>
{
  constructor(private trainingJournalsRepo: TrainingJournalsRepository) {}

  async execute(query: GetAvailableSportTypesQuery): Promise<SportTypeEnum[]> {
    const journals =
      await this.trainingJournalsRepo.getAllTrainingJournalsByAthleteId(
        query.athleteId,
      );

    const used = new Set<SportTypeEnum>(
      journals.map((journal) => journal.sportType as SportTypeEnum),
    );

    return (Object.values(SportTypeEnum) as SportTypeEnum[]).filter(
      (sportType) => !used.has(sportType),
    );
  }
}

