import { PickType } from '@nestjs/mapped-types';
import { User } from 'src/users/entities/user.entity';

export class AuthDto extends PickType(User, ['email', 'password']) {}
