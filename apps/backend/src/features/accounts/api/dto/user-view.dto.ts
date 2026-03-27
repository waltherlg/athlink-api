import { ApiProperty } from '@nestjs/swagger';
import type { UserView } from '@shared-types';

export class UserViewDto implements UserView {
  @ApiProperty({ example: '3d057bd4-817d-4f0d-b058-55abc187086a' })
  id: string;
  @ApiProperty({ example: 'email@abc.com' })
  email: string;
  @ApiProperty({ example: 'newUserName' })
  userName: string;
  @ApiProperty({ example: '2026-03-13T12:39:48.527Z' })
  createdAt: string;
  @ApiProperty({ example: '2026-03-13T12:39:48.527Z' })
  updatedAt: string;
}
