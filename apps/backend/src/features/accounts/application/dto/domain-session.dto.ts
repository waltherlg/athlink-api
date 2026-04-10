import { Session } from '@prisma/client';

export class CreateSessionDto {
  id: string;
  userId: string;
  refreshTokenHash: string;
  ip: string;
  userAgent: string;
  expiresAt: Date;
}

export class UpdateSessionDto {
  refreshTokenHash: string;
  expiresAt: Date;
  lastActiveAt: Date;
}

// export class CreateSessionData {
//   userId: string;
//   refreshTokenHash: string;
//   ip: string;
//   userAgent: string;
// }

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
