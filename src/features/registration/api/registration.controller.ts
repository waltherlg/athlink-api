import { Controller, Get } from '@nestjs/common';
import { PATH_CONSTS_REG } from '../consts/path.consts';

@Controller(PATH_CONSTS_REG.REGISTRATION_CONTROLLER)
export class RegistrationController {
  @Get()
  returnHello() {
    return 'hello world';
  }
}
