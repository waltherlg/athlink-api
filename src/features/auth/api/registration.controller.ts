import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRegistrationInputDto } from './dto/registration.dto';
import { PATH_CONSTS_AUTH } from '../consts/path.consts';

@Controller(PATH_CONSTS_AUTH.REGISTRATION_CONTROLLER)
export class RegistrationController {
  @Get()
  returnHello() {
    return 'hello world';
  }

  @Post()
  async registerUser(@Body() dto: UserRegistrationInputDto) {}
}
