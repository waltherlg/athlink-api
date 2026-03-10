import { Body, Controller, Get, Post } from '@nestjs/common';
import { PATH_CONSTS_REG } from '../consts/path.consts';
import { UserRegistrationInputDto } from './dto/registration.dto';

@Controller(PATH_CONSTS_REG.REGISTRATION_CONTROLLER)
export class RegistrationController {
  @Get()
  returnHello() {
    return 'hello world';
  }

  @Post()
  async registerUser(@Body() dto: UserRegistrationInputDto) {}
}
