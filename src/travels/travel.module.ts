import { Module } from '@nestjs/common';

import { PlanController } from './plan/plan.controller';
import { PlanService } from './plan/plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { planRepository } from './plan/plan.repository';
import { TypeOrmExModule } from 'src/repositories/custom-repository.module';
import { UserRespository } from 'src/users/users.repository';
import { TravelController } from './travel/travel.controller';
import { TravelService } from './travel/travel.service';
import { Destination } from './entities/destination.entity';
import { DestinationRepository } from './repositories/destination.repository';
import { TravelRepository } from './repositories/travel.repository';
import { Travel } from './entities/travel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, Destination, Travel]),
    TypeOrmExModule.forCustomRepository([UserRespository]),
  ],
  controllers: [TravelController, PlanController],
  providers: [
    TravelService,
    PlanService,
    planRepository,
    DestinationRepository,
    TravelRepository,
  ],
})
export class TravelModule {}
