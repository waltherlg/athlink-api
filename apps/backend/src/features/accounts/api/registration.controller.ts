import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRegistrationInputDto } from './dto/registration.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UserRegistrationCommand } from '../application/use-cases/user-registration.use-case';
import { ApiTags } from '@nestjs/swagger';
import {
  RegisterUserSwagger,
  SW_AUTH_TITLES,
} from './swagger/registration.swagger';
import { UserViewDto } from './dto/user-view.dto';
import { ACCOUNTS_PATH_CONSTS } from '../consts/path.consts';

@ApiTags(SW_AUTH_TITLES.REGISTRATION_CONTROLLER)
@Controller(ACCOUNTS_PATH_CONSTS.REGISTRATION_CONTROLLER)
export class RegistrationController {
  constructor(private commandBus: CommandBus) {}
  @Get()
  returnHello() {
    return 'hello world';
  }

  @RegisterUserSwagger()
  @Post()
  async registerUser(@Body() dto: UserRegistrationInputDto) {
    const createdUser: UserViewDto = await this.commandBus.execute(
      new UserRegistrationCommand(dto),
    );
    return createdUser;
  }
}
