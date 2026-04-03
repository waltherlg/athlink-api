import { Session } from '@prisma/client';

export class SessionCreateDto {
  userId: string;
  refreshTokenHash: string;
  ip: string;
  userAgent: string;
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
