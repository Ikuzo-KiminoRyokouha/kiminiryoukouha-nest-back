import { Controller, Get } from '@nestjs/common';

@Controller('board')
export class BoardsController {
  constructor() {}
  @Get()
  sayHello() {
    return 'hello';
  }
}
