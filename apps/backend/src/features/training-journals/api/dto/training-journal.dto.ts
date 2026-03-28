import { ApiProperty } from '@nestjs/swagger';
import { SportTypeEnum, TrainingJournalView } from '@shared-types';
import { CreateTrainingJournalInput } from '@shared-types';
import { IsEnum, IsNotEmpty } from 'class-validator';

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

