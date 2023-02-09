import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';
import { Plan } from '../entities/plan.entity';
import { Travel } from '../entities/travel.entity';

@Injectable()
export class TravelRepository {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
  ) {}

  async showTravel(travelId: number): Promise<Travel | null> {
    try {
      const travel = await this.travelRepository.findOne({
        where: { id: travelId },
      });
      if (!travel) return null;
      return travel;
    } catch (error) {
      throws;
    }
  }

  async showTravelsByPlanId(planId) {
    try {
      console.log(planId);
      const travels = await this.travelRepository.find({
        where: { planId },
      });
      console.log('ddd', travels);
      return travels;
    } catch (error) {
      console.log(error);
      throws;
    }
  }

  async creatTravel(createTravelInput): Promise<Travel[]> {
    try {
      const travel = await this.travelRepository.save(
        this.travelRepository.create({
          ...createTravelInput,
          plan: createTravelInput.planId,
          destination: createTravelInput.destinationId,
        }),
      );
      return travel;
    } catch (error) {
      throws;
    }
  }

  async updateTravel(
    travelId: number,
    updateTravelInput: Travel,
  ): Promise<Travel[]> {
    try {
      const travel = await this.travelRepository.save([
        { id: travelId, ...updateTravelInput },
      ]);
      return travel;
    } catch (error) {
      throws;
    }
  }

  async addRandomTravel({ planId, tag }, travels) {
    console.log(travels);
    // const newTravel = await this.travelRepository.createQueryBuilder('travel').where('travel')
  }
}
