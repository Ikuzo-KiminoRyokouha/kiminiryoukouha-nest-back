import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity } from 'typeorm';

export enum UserRole {
  Client = 'Client',
  Manager = 'Manager',
}

@Entity()
export class User extends BasicEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  nickname: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;
}
