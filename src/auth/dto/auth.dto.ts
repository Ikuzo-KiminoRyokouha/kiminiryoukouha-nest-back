import { PickType } from '@nestjs/mapped-types';
import { User } from '../../users/entities/user.entity';

export class AuthDto extends PickType(User, ['email', 'password']) {}
