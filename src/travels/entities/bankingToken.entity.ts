import { IsNumber, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class BankingToken {
  @PrimaryColumn()
  @IsString()
  userNo: string;

  @Column({ type: 'text' })
  @IsString()
  accessToken: string;

  @Column({ type: 'text' })
  @IsString()
  refreshToken: string;

  @Column({ nullable: true })
  @IsString()
  finNum: string;

  @Column({ nullable: true })
  @IsString()
  bank_name: string;

  @Column({ nullable: true })
  @IsString()
  account_num: string;

  @OneToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  @IsNumber()
  userId: number;

  @Column({ default: 0 })
  @IsNumber()
  checking: number;
}
