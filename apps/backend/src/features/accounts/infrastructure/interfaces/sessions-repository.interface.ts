import {
  SessionCreateDto,
  SessionDto,
} from '../../application/dto/domain-session.dto';

export interface SessionsRepositoryInterface {
  findOne(deviceId: string): Promise<SessionDto | null>;
  create(dto: SessionCreateDto): Promise<string>;
  delete(deviceId: string): Promise<boolean>;
  deleteAllExceptCurrent(deviceId: string, userId: string): Promise<boolean>;
}
