import { Body, Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserRespository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRespository) {}
}
