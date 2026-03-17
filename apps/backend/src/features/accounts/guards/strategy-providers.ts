import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local/local.strategy';

export const GuardsStrategy = [LocalStrategy, JwtStrategy];
