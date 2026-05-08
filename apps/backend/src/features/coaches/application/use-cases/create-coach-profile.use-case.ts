import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SportTypeEnum } from '@shared-types';
import { CoachesRepository } from '../../infrastructure/coaches.repository';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { COACH_ERROS } from '../../consts/coaches-errors.consts';
import { createCoachProfileDto } from '../dto/domain-coach.dto';

@Injectable()
export class CreateCoachProfileCommand {
  constructor(
    public userId: string,
    public sportType: SportTypeEnum,
  ) {}
}

@CommandHandler(CreateCoachProfileCommand)
export class CreateCoachProfileUseCase implements ICommandHandler<CreateCoachProfileCommand> {
  constructor(private coachesRepository: CoachesRepository) {}

  async execute(command: CreateCoachProfileCommand): Promise<boolean> {
    const isProfileAlreadyExist =
      await this.coachesRepository.getCoachProfileByUserIdAndSportType(
        command.userId,
        command.sportType,
      );
    if (isProfileAlreadyExist) {
      throw BadRequestDomainException.create(
        COACH_ERROS.TRAINING_JOURNAL_ALREADY_EXISTS,
      );
    }
    const dto: createCoachProfileDto = {
      userId: command.userId,
      sportType: command.sportType,
    };
    const newProfile = await this.coachesRepository.createCoachProfile(dto);
    return !!newProfile;
  }
}
