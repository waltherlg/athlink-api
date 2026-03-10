import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRegistrationInputDto } from '../../api/dto/registration.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UserCreateDto } from '../../../users/application/dto/create-user.dto';

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
    const createdUser = await this.userRepo.createUser(userDto);
    return createdUser;
  }
}
