import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AthleteDashboardDataViewDto } from '../../api/dto/dashboard-api.dto';
import { TrainingJournalsRepository } from '../../../training-journals/infrastructure/training-journals.repository';
import { TrainingRecordsRepository } from '../../../training-journals/infrastructure/training-records.repository';
import { mapAthleteDashboardDataView } from '../helpers/dashboard.helper';

export class GetAthleteDesboardQuery {
  constructor(public athleteId: string) {}
}

@QueryHandler(GetAthleteDesboardQuery)
export class GetAthleteDesboardQueryHandler implements IQueryHandler<GetAthleteDesboardQuery> {
  constructor(
    private trainingJournalsRepo: TrainingJournalsRepository,
    private trainingRecordsRepo: TrainingRecordsRepository,
  ) {}

  execute(
    query: GetAthleteDesboardQuery,
  ): Promise<AthleteDashboardDataViewDto> {
    const { athleteId } = query;
    return this.buildDashboard(athleteId);
  }

  private async buildDashboard(
    athleteId: string,
  ): Promise<AthleteDashboardDataViewDto> {
    const journals =
      await this.trainingJournalsRepo.getAllTrainingJournalsByAthleteId(
        athleteId,
      );

    const journalIds = journals.map((journal) => journal.id);

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    const [latestRecords, todayRecordJournalIds] = await Promise.all([
      this.trainingRecordsRepo.getLatestRecordsByTrainingJournalIds(journalIds),
      this.trainingRecordsRepo.getTrainingJournalIdsWithRecordsInRange(
        journalIds,
        startOfToday,
        startOfTomorrow,
      ),
    ]);
    return mapAthleteDashboardDataView(
      journals,
      latestRecords,
      todayRecordJournalIds,
    );
  }
}
