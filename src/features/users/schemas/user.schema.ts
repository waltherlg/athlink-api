import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const UserSchema = z.object({
  id: z.string(),
  userName: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type ZodUser = z.infer<typeof UserSchema>;

type PrismaUser = Prisma.UserGetPayload<{}>;

const _typeCheck: PrismaUser = {} as ZodUser;
