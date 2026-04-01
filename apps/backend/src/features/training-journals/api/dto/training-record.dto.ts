import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateTrainingRecordInput,
  PaginationOutputModel,
  RequestQueryParamsModel,
  TrainingRecordAthleteView,
} from '@shared-types';
import { IsOptional, IsString } from 'class-validator';

export class CreateTrainingRecordInputDto implements CreateTrainingRecordInput {
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
}

export class TrainingRecordAthleteViewDto implements TrainingRecordAthleteView {
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  id: string;

  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  trainingJournalId: string;

  @ApiProperty({ example: '628.9', nullable: true })
  result: string | null;

  @ApiProperty({ example: 'Coach notes', nullable: true })
  coachNotes: string | null;

  @ApiProperty({ example: 'Private notes', nullable: true })
  privateNotes: string | null;

  @ApiProperty({ example: '2026-03-13T12:39:48.527Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-03-13T12:39:48.527Z' })
  updatedAt: string;
}

export class TrainingRecordsQueryParamsDto
  implements Partial<RequestQueryParamsModel>
{
  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'DESC' })
  @IsOptional()
  @IsString()
  sortDirection?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  pageNumber?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsString()
  pageSize?: string;
}

export class TrainingRecordsPaginationViewDto
  implements PaginationOutputModel<TrainingRecordAthleteViewDto>
{
  @ApiProperty({ example: 1 })
  pagesCount: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 1 })
  totalCount: number;

  @ApiProperty({ type: TrainingRecordAthleteViewDto, isArray: true })
  items: TrainingRecordAthleteViewDto[];
}

