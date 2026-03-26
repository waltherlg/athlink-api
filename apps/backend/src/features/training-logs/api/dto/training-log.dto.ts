import { ApiProperty } from '@nestjs/swagger';
import { SportTypeEnum, TrainingLogView } from '@shared-types';
import { CreateTrainingLogInput } from '@shared-types';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateTrainingLogInputDto implements CreateTrainingLogInput {
  @ApiProperty({
    enum: SportTypeEnum,
    example: SportTypeEnum.SHOOTING,
  })
  @IsNotEmpty()
  @IsEnum(SportTypeEnum)
  sportType: SportTypeEnum;
}

export class TrainingLogViewDto implements TrainingLogView {
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
