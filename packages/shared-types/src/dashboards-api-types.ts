import { SportTypeEnum } from './training-journals-api-types';
import { PaginationOutputModel } from './query-models';

export type AthleteDashboardDataView = {
  journals:
    | {
        id: string;
        sportType: SportTypeEnum;
        latestRecord: {
          id: string;
          date: string;
          result: number | null;
        };
        hasTodayRecord: boolean;
      }[]
    | null;
};

export type CoachDashboardJournalView = {
  id: string;
  athleteUserName: string;
  sportType: SportTypeEnum;
  latestRecord: {
    id: string;
    date: string;
    event: string | null;
    result: number | null;
    coachNotes: string | null;
  } | null;
};

export type CoachDashboardDataView =
  PaginationOutputModel<CoachDashboardJournalView>;
