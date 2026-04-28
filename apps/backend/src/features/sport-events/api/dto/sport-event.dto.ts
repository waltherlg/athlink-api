import { ApiProperty } from '@nestjs/swagger';
import { ResultTypeEnum, SportEventView, SportTypeEnum } from '@shared-types';

export class SportEventViewDto implements SportEventView {
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  id: string;

  @ApiProperty({
    enum: SportTypeEnum,
    example: SportTypeEnum.SHOOTING_RIFLE_PISTOL,
  })
  sportType: SportTypeEnum;

  @ApiProperty({ example: 'AIR_RIFLE_60' })
  code: string;

  @ApiProperty({ example: 'Air Rifle 60' })
  name: string;

  @ApiProperty({ enum: ResultTypeEnum, example: ResultTypeEnum.SCORE })
  resultType: ResultTypeEnum;

  @ApiProperty({ example: 654, nullable: true })
  maxScore: number | null;

  @ApiProperty({ example: 1, nullable: true })
  decimals: number | null;

  @ApiProperty({ example: '2026-03-13T12:39:48.527Z' })
  createdAt: string;
}
