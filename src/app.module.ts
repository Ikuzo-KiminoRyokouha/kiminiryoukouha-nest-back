import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './boards/board.module';
import { CommonModule } from './common/common.module';
import { ormOptions } from './database/ormconfig';
import { TravelModule } from './travels/travel.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      // ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(ormOptions),

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
