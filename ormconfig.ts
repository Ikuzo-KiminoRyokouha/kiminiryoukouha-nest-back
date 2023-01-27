import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comment } from './src/boards/entities/comment.entity';
import { Board } from './src/boards/entities/board.entity';
import { Destination } from './src/travels/entities/destination.entity';
import { Diary } from './src/travels/entities/diary.eneity';
import { Plan } from './src/travels/entities/plan.entity';
import { Travel } from './src/travels/entities/travel.entity';
import { User } from './src/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { Rating } from './src/travels/entities/rating.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'prod',
  // synchronize: true,
  logging: true,
  entities: [User, Plan, Diary, Board, Comment, Travel, Destination, Rating],
};

export = config;
