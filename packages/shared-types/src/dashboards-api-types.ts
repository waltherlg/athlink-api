import { SportTypeEnum } from './training-journals-api-types';

export type AthleteDashboardDataView = {
  journals:
    | {
        id: string;
        sportType: SportTypeEnum;
        latestRecord: {
          id: string;
          date: string;
          result: string;
        };
        hasTodayRecord: boolean;
      }[]
    | null;
};
