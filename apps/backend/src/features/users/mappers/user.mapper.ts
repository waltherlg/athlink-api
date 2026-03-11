import { User } from '@prisma/client';
import { UserViewDto } from '../application/dto/user-view.dto';

export class UserMapper {
  static toViewDto(user: User): UserViewDto {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,

      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
