import { UserSchema } from '../../schemas/user.schema';
import { createZodDto } from '@anatine/zod-nestjs';

export const UserCreateSchema = UserSchema.pick({
  email: true,
  userName: true,
  passwordHash: true,
}).required();

export class UserCreateDto extends createZodDto(UserCreateSchema) {}
