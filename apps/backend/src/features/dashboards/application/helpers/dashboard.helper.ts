import { TrainingJournal, TrainingRecord } from '@prisma/client';
import { AthleteDashboardDataViewDto } from '../../api/dto/dashboard-api.dto';
import { SportTypeEnum } from '@shared-types';

export function mapAthleteDashboardDataView(
  journals: TrainingJournal[],
  latestRecords: TrainingRecord[],
  todayRecordJournalIds: string[],
): AthleteDashboardDataViewDto {
  if (journals.length === 0) {
    return { journals: null };
  }

  const latestRecordByJournalId = new Map<string, TrainingRecord>();
  for (const record of latestRecords) {
    if (!latestRecordByJournalId.has(record.trainingJournalId)) {
      latestRecordByJournalId.set(record.trainingJournalId, record);
    }
  }

  const todayRecordSet = new Set(todayRecordJournalIds);

  return {
    journals: journals.map((journal) => {
      const latestRecord = latestRecordByJournalId.get(journal.id);
      return {
        id: journal.id,
        sportType: journal.sportType as SportTypeEnum,
        latestRecord: latestRecord
          ? {
              id: latestRecord.id,
              date: latestRecord.createdAt.toISOString(),
              result: latestRecord.result.toString() ?? '',
            }
          : { id: '', date: '', result: '' },
        hasTodayRecord: todayRecordSet.has(journal.id),
      };
    }),
  };
}
