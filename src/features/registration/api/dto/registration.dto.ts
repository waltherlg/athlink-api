import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const UserRegisterSchema = z.object({
  email: z.string(),
  userName: z.string().min(3).max(20),
  password: z.string().min(6),
});

export class UserRegistrationInputDto extends createZodDto(
  UserRegisterSchema,
) {}
