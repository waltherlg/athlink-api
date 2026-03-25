import { SportTypeEnum } from '@shared-types';
import { CreateTrainingLogInput } from '@shared-types';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateTrainingLogInputDto implements CreateTrainingLogInput {
  @IsNotEmpty()
  @IsEnum(SportTypeEnum)
  sportType: SportTypeEnum;
}
