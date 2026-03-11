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

type ZodUser = z.output<typeof UserSchema>;

type PrismaUser = Prisma.UserGetPayload<{}>;

type IsExact<A, B> = [A] extends [B]
  ? ([B] extends [A] ? true : false)
  : false;

const _typeCheck: IsExact<ZodUser, PrismaUser> = true;
