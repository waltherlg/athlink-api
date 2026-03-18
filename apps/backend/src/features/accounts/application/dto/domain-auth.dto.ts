export class JwtPayloadDto {
  id: string;
  deviceId: string;
  iat: number;
  exp: number;
}

export class accessAndRefreshTokenDto {
  accessToken: string;
  refreshToken: string;
}
