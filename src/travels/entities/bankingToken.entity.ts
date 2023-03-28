import { IsNumber, IsString } from 'class-validator';
import { BasicEntity } from 'src/common/entities/basic.entity';
import { User } from 'src/users/entities/user.entity';
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

  @OneToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  @IsNumber()
  userId: number;

  @Column({ default: '00000000' })
  @IsString()
  check: string;
}
