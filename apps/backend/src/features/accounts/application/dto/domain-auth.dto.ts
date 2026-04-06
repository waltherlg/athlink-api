export class JwtPayloadDto {
  userId: string;
  sessionId: string;
  iat: number;
  exp: number;
}

export class accessAndRefreshTokenDto {
  accessToken: string;
  refreshToken: string;
}
