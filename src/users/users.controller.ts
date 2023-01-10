import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // register(
  //   @Body() createUserInput: CreateUserInput,
  // ): Promise<CreateUserOutput> {
  //   return this.usersService.register(createUserInput);
  // }

  // @Post('auth')
  // login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
  //   return this.usersService.login(loginInput);
  // }
}
