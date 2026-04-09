import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRegistrationInputDto } from '../../../api/dto/registration.dto';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserCreateDto } from '../../dto/domain-user.dto';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { UserMapper } from '../../../mappers/user.mapper';
import { UserViewDto } from '../../../api/dto/user-view.dto';
import { ACCOUNT_ERRORS } from '../../../consts/account-errors.consts';
import { CryptoService } from '../../services/crypto.service';
import { randomUUID } from 'node:crypto';

export class UserRegistrationCommand {
  constructor(public dto: UserRegistrationInputDto) {}
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase implements ICommandHandler<UserRegistrationCommand> {
  constructor(
    private userRepo: UsersRepository,
    private passwordService: CryptoService,
  ) {}

  async execute(command: UserRegistrationCommand): Promise<UserViewDto> {
    const { userName, email, password } = command.dto;

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

    const passwordHash = await this.passwordService.hash(password);
    const confirmationCode = randomUUID();
    const confirmCodeExpiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const userDto: UserCreateDto = {
      userName,
      email,
      passwordHash,
      confirmationCode,
      confirmCodeExpiryDate,
      isConfirmed: false,
    };

    const createdUser = await this.userRepo.createUser(userDto);

    return UserMapper.toViewDto(createdUser);
  }
}
