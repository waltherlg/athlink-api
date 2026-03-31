import { ApiProperty } from '@nestjs/swagger';
import { AthleteDashboardDataView, SportTypeEnum } from '@shared-types';

export class LatestRecordDto {
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  id: string;

  @ApiProperty({ example: '2026-03-13T12:39:48.527Z' })
  date: string;

  @ApiProperty({ example: '628.9' })
  result: string;
}

export class JournalDto {
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  id: string;

  @ApiProperty({ enum: SportTypeEnum })
  sportType: SportTypeEnum;

  @ApiProperty({ type: LatestRecordDto })
  latestRecord: LatestRecordDto;

  @ApiProperty()
  hasTodayRecord: boolean;
}

export class AthleteDashboardDataViewDto implements AthleteDashboardDataView {
  @ApiProperty({ type: [JournalDto], nullable: true })
  journals: JournalDto[] | null;
}
