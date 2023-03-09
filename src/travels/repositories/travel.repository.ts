import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { Repository } from 'typeorm';
import { CreateTravelInput } from '../dtos/travel/create-travel.dto';
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
      const travels = await this.travelRepository.find({
        where: { planId },
        // order: { startDay: 'ASC' },
      });
      return travels;
    } catch (error) {
      throws;
    }
  }

  async copyTravel(travel: Travel, startDay, planId) {
    try {
      const maxId = await this.getMaxId();
      delete travel.createdAt;
      delete travel.updatedAt;
      const copyTravel = await this.travelRepository.save({
        ...travel,
        startDay,
        planId,
        clear: false,
        id: maxId.max + 1,
      });
      return copyTravel;
    } catch (error) {
      throws;
    }
  }

  async getMaxId() {
    try {
      const maxId = await this.travelRepository
        .createQueryBuilder('travel')
        .select('MAX(travel.id) AS max')
        .getRawOne();
      return maxId;
    } catch (error) {}
  }

  async creatTravel(createTravelInput: CreateTravelInput): Promise<Travel> {
    try {
      const travel = await this.travelRepository.save(
        this.travelRepository.create({
          ...createTravelInput,
          planId: createTravelInput.planId,
          destinationId: createTravelInput.destinationId,
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
    // const newTravel = await this.travelRepository.createQueryBuilder('travel').where('travel')
  }
}
