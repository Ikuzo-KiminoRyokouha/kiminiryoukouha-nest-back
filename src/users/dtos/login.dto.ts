import { PickType } from '@nestjs/mapped-types';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

export class LoginInput extends PickType(User, ['email', 'password']) {}

export class LoginOutput extends BasicOutput {}
