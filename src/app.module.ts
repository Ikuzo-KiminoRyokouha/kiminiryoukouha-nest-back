import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { TravelModule } from './travels/travel.module';
import { Plan } from './travels/entities/plan.entity';
import { Diary } from './travels/entities/diary.eneity';
import { BoardModule } from './boards/board.module';
import { Board } from './boards/entities/board.entity';
import { Comment } from './boards/entities/comment.entity';
import { Travel } from './travels/entities/travel.entity';
import { Destination } from './travels/entities/destination.entity';
import * as ormconfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      // synchronize: true,
      logging: true,
      entities: [User, Plan, Diary, Board, Comment, Travel, Destination],
      //   seeds: ['src/database/seeds/**/*.ts'],
    }),

    UsersModule,
    CommonModule,
    AuthModule,
    TravelModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
