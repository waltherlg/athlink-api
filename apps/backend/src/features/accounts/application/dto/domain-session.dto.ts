import { Session } from '@prisma/client';

export class SessionCreateDto {
  userId: string;
  refreshTokenHash: string;
  ip: string;
  userAgent: string;
  expiresAt: Date;
  lastActiveAt: Date;
}

export class SessionDto implements Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastActiveAt: Date;
}
