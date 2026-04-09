import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local/local.strategy';
import { RefreshTokenStrategy } from './refresh/refresh.token.strategy';

export const GuardsStrategy = [
  LocalStrategy,
  JwtStrategy,
  RefreshTokenStrategy,
];
