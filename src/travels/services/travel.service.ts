import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { throwError } from 'rxjs';

import { BasicOutput } from '../../common/dtos/output.dto';
import { CreateRandomPlanInput } from '../dtos/plan/craete-random-plan.dto';
import {
  AddRandomTravelInput,
  AddRandomTravelOutput,
} from '../dtos/travel/add-random-travel.dto';
import { CreateTravelInput } from '../dtos/travel/create-travel.dto';
import { UpdateTravelClearOutput } from '../dtos/travel/update-travel-clear.dto';
import { DestinationRepository } from '../repositories/destination.repository';
import { planRepository } from '../repositories/plan.repository';
import { TravelRepository } from '../repositories/travel.repository';

@Injectable()
export class TravelService {
  constructor(
    private travelRespository: TravelRepository,
    private destinaitonRespoeitory: DestinationRepository,
    private planRepository: planRepository,
  ) {}

  async createTravelPerDay(
    createRandomPlanInput: CreateRandomPlanInput,
    planId,
    dayPerDes,
    i,
  ) {
    const startDay = new Date(createRandomPlanInput.start);

    const travels = [];
    for (let i = 0; i < 2; i++) {
      const createTravelInput: CreateTravelInput = {
        startDay: new Date(startDay.setDate(startDay.getDate() + i)),
        planId: planId,
        destinationId: dayPerDes[i].id,
      };
      const travel = await this.travelRespository.creatTravel(
        createTravelInput,
      );
      travels.push(travel);
    }
    return travels;
  }

  async updateTravelClear(travelId: number): Promise<UpdateTravelClearOutput> {
    try {
      const travel = await this.travelRespository.showTravel(travelId);
      if (!travel) return { ok: false, message: 'cannot find this travel' };

      await this.travelRespository.updateTravel(travelId, {
        ...travel,
        clear: !travel.clear,
      });
      return { ok: true, message: 'update travel to clear' };
    } catch (error) {
      return { ok: false, error: 'failed to update travel' };
    }
  }

  async updateTravelDes(travelId: number): Promise<BasicOutput> {
    try {
      const travel = await this.travelRespository.showTravel(travelId);
      if (!travel) return { ok: false, message: 'cannot find this travel' };
      console.log('travel', travel);
      const destination = await this.destinaitonRespoeitory.showDestinationById(
        travel.destinationId,
      );
      const updateDestination = await this.destinaitonRespoeitory.getRaondomDes(
        [destination.cat3],
        [0],
      );
      const updateTravel = await this.travelRespository.updateTravel(travelId, {
        ...travel,
        destination: updateDestination,
      });
      if (!updateTravel) throwError;
      return { ok: true, message: 'update travel' };
    } catch (error) {
      return { ok: false, error: 'failed to update travel' };
    }
  }

  async updateTravelByDestinationId(travelId: number, destinationId: number) {
    try {
      const destination = await this.destinaitonRespoeitory.showDestinationById(
        destinationId,
      );
      if (!destination)
        return { ok: false, error: 'not found this destination' };
      const travel = await this.travelRespository.showTravel(travelId);
      if (!travel) return { ok: false, error: 'not found this travel' };
      const updateTravle = await this.travelRespository.updateTravel(travelId, {
        ...travel,
        destination,
      });
      if (!updateTravle) throwError;
      return {
        ok: true,
        message: 'success to update travel',
      };
    } catch (error) {
      return {
        ok: false,
        message: 'failed to update travel',
      };
    }
  }

  async addRandomTravel(
    addRandomTravelInput: AddRandomTravelInput,
  ): Promise<AddRandomTravelOutput> {
    try {
      //여행 계획 플랜 가져오기
      const plan = await this.planRepository.showPlan(
        addRandomTravelInput.planId,
      );
      //여행지 id 담을 임시 배열
      const tempTravelIdArr = [];
      //임시배열에 여행지 id만 담음
      plan.travels.forEach((element) => {
        tempTravelIdArr.push(element.id);
      });

      //배열에 없는 여행지를 추천
      const newDestination = await this.destinaitonRespoeitory.getRaondomDes(
        addRandomTravelInput.tag,
        tempTravelIdArr,
      );
      const createNewTravelInput: CreateTravelInput = {
        startDay: new Date(),
        planId: plan.id,
        destinationId: newDestination.id,
      };
      const newTravel = await this.travelRespository.creatTravel(
        createNewTravelInput,
      );
      // console.log(newTravel);
      return { ok: true, travel: newTravel };
    } catch (error) {
      return { ok: false, error: 'faield to add travel' };
    }
  }

  @Cron('0 23 16 * * *')
  test() {
    console.log('scheduler');
  }
}
