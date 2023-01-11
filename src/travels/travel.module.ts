import { Module } from '@nestjs/common';

import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { planRepository } from './repositories/plan.repository';
import { TypeOrmExModule } from 'src/repositories/custom-repository.module';
import { UserRespository } from 'src/users/users.repository';
import { TravelController } from './controllers/travel.controller';
import { TravelService } from './services/travel.service';
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
