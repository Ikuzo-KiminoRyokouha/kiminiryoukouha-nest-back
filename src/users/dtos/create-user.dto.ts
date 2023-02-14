import { PickType } from '@nestjs/mapped-types';
import { BasicOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'nickname',
  'role',
]) {}

export class CreateUserOutput extends BasicOutput {}
