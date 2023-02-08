import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { BasicEntity } from '../../common/entities/basic.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany } from 'typeorm';

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

  @Column({ unique: true })
  @IsString()
  nickname: string;

  @Column({ nullable: true })
  @IsString()
  description: string;

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  @IsOptional()
  followers: User[];

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  @IsOptional()
  followees: User[];

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;
}
