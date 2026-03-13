import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRegistrationInputDto } from '../../api/dto/registration.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserCreateDto } from '../dto/create-user.dto';
import {
  BadRequestDomainException,
  DomainException,
} from '../../../../core/exceptions/domain-exceptions';

export class UserRegistrationCommand {
  constructor(public dto: UserRegistrationInputDto) {}
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase implements ICommandHandler<UserRegistrationCommand> {
  constructor(private userRepo: UsersRepository) {}

  async execute(command: UserRegistrationCommand): Promise<any> {
    const { userName, email, password } = command.dto;
    const userDto: UserCreateDto = {
      userName,
      email,
      passwordHash: password,
    };

    if (await this.userRepo.isEmailExist(email)) {
      throw BadRequestDomainException.create();
    }

    if (await this.userRepo.isUserNameExist(userName)) {
      throw BadRequestDomainException.create();
    }

    const createdUser = await this.userRepo.createUser(userDto);

    return createdUser;
  }
}
