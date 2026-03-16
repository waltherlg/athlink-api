import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRegistrationInputDto } from '../../api/dto/registration.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserCreateDto } from '../dto/create-user.dto';
import {
  BadRequestDomainException,
  DomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { UserMapper } from '../../mappers/user.mapper';
import { UserViewDto } from '../../api/dto/user-view.dto';
import { ACCOUNT_ERRORS } from '../../consts/account-errors.consts';

export class UserRegistrationCommand {
  constructor(public dto: UserRegistrationInputDto) {}
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase implements ICommandHandler<UserRegistrationCommand> {
  constructor(private userRepo: UsersRepository) {}

  async execute(command: UserRegistrationCommand): Promise<UserViewDto> {
    const { userName, email, password } = command.dto;
    const userDto: UserCreateDto = {
      userName,
      email,
      passwordHash: password,
    };

    if (await this.userRepo.isEmailExist(email)) {
      throw BadRequestDomainException.create(
        ACCOUNT_ERRORS.EMAIL_ALREADY_EXITS,
      );
    }

    if (await this.userRepo.isUserNameExist(userName)) {
      throw BadRequestDomainException.create(
        ACCOUNT_ERRORS.USER_NAME_ALREADY_EXITS,
      );
    }

    const createdUser = await this.userRepo.createUser(userDto);

    return UserMapper.toViewDto(createdUser);
  }
}
