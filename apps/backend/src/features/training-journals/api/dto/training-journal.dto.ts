import { ApiProperty } from '@nestjs/swagger';
import {
  SportTypeEnum,
  TrainingJournalView,
  TrainingJournalWithLatestRecordsView,
} from '@shared-types';
import { CreateTrainingJournalInput } from '@shared-types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TrainingRecordAthleteViewDto } from './training-record.dto';

export class CreateTrainingJournalInputDto implements CreateTrainingJournalInput {
  @ApiProperty({
    enum: SportTypeEnum,
    example: SportTypeEnum.SHOOTING,
  })
  @IsNotEmpty()
  @IsEnum(SportTypeEnum)
  sportType: SportTypeEnum;
}

export class TrainingJournalViewDto implements TrainingJournalView {
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  id: string;
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  athleteId: string;
  @ApiProperty({
    enum: SportTypeEnum,
    example: SportTypeEnum.SHOOTING,
  })
  sportType: SportTypeEnum;
}

export class TrainingJournalWithLatestRecordsViewDto
  implements TrainingJournalWithLatestRecordsView
{
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  id: string;

  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  athleteId: string;

  @ApiProperty({
    enum: SportTypeEnum,
    example: SportTypeEnum.SHOOTING,
  })
  sportType: SportTypeEnum;

  @ApiProperty({ type: TrainingRecordAthleteViewDto, isArray: true })
  latestRecords: TrainingRecordAthleteViewDto[];
}

