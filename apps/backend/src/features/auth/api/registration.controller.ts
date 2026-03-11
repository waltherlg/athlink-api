import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRegistrationInputDto } from './dto/registration.dto';
import { PATH_CONSTS_AUTH } from '../consts/path.consts';
import { CommandBus } from '@nestjs/cqrs';
import { UserRegistrationCommand } from '../application/use-cases/user-registration.use-case';

@Controller(PATH_CONSTS_AUTH.REGISTRATION_CONTROLLER)
export class RegistrationController {
  constructor(private commandBus: CommandBus) {}
  @Get()
  returnHello() {
    return 'hello world';
  }

  @Post()
  async registerUser(@Body() dto: UserRegistrationInputDto) {
    return this.commandBus.execute(new UserRegistrationCommand(dto));
  }
}
