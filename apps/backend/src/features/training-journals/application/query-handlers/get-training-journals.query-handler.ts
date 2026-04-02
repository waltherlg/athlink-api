import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';
import { TrainingJournalViewDto } from '../../api/dto/training-journal.dto';
import { SportTypeEnum } from '@shared-types';

export class GetTrainingJournalsQuery {
  constructor(public athleteId: string) {}
}

@QueryHandler(GetTrainingJournalsQuery)
export class GetTrainingJournalsQueryHandler
  implements IQueryHandler<GetTrainingJournalsQuery>
{
  constructor(private trainingJournalsRepo: TrainingJournalsRepository) {}

  async execute(
    query: GetTrainingJournalsQuery,
  ): Promise<TrainingJournalViewDto[]> {
    const journals =
      await this.trainingJournalsRepo.getAllTrainingJournalsByAthleteId(
        query.athleteId,
      );

    return journals.map((journal) => ({
      id: journal.id,
      athleteId: journal.athleteId,
      sportType: journal.sportType as SportTypeEnum,
    }));
  }
}
