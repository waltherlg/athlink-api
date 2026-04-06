import {
  CreateSessionDto,
  SessionDto,
  UpdateSessionDto,
} from '../../application/dto/domain-session.dto';

export interface SessionsRepositoryInterface {
  findOne(sessionId: string): Promise<SessionDto | null>;
  create(dto: CreateSessionDto): Promise<string>;
  update(sessionId: string, dto: UpdateSessionDto): Promise<boolean>;
  delete(userId: string, sessionId: string): Promise<boolean>;
  deleteAllExceptCurrent(deviceId: string, userId: string): Promise<boolean>;
}
