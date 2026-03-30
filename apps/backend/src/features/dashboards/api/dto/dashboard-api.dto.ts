import { AthleteDashboardDataOutput, SportTypeEnum } from '@shared-types';

export class AthleteDashboardDataOutputDto implements AthleteDashboardDataOutput {
  journals: {
    id: string;
    sportType: SportTypeEnum;
    latestRecord: {
      id: string;
      date: string;
      result: string;
    };
    hasTodayRecord: boolean;
  }[];
}
