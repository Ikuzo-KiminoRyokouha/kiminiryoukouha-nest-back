import { Board, CommComments, Comment, Community } from './src/boards/entities';
import { Destination } from './src/travels/entities/destination.entity';
import { Plan } from './src/travels/entities/plan.entity';
import { Rating } from './src/travels/entities/rating.entity';
import { Travel } from './src/travels/entities/travel.entity';
import { User } from './src/users/entities/user.entity';

const ormConfig = {
  type: 'mysql' as 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'prod',
  // synchronize: true,
  logging: true,
  entities: [User, Plan, Board, Comment, Travel, Destination, Rating, Community, CommComments],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  timezone: 'KST',
  //   seeds: ['src/database/seeds/**/*.ts'],
};

export default ormConfig;
