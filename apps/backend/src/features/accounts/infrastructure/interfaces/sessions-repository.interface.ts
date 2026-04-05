import {
  CreateSessionDto,
  SessionDto,
} from '../../application/dto/domain-session.dto';

export interface SessionsRepositoryInterface {
  findOne(sessionId: string): Promise<SessionDto | null>;
  create(dto: CreateSessionDto): Promise<string>;
  delete(userId: string, sessionId: string): Promise<boolean>;
  deleteAllExceptCurrent(deviceId: string, userId: string): Promise<boolean>;
}
