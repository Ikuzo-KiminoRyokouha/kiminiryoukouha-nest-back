import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { throwError } from 'rxjs';
import { Request } from 'express';
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
import { AddTraveOutPut } from '../dtos/travel/add-travel.dto';

@Injectable()
export class TravelService {
  constructor(
    private travelRespository: TravelRepository,
    private destinaitonRespoeitory: DestinationRepository,
    private planRepository: planRepository,
  ) {}

  async updateTravelClear(
    travelId: number,
    req: Request,
  ): Promise<UpdateTravelClearOutput> {
    try {
      const travel = await this.travelRespository.showTravel(travelId);
      if (!travel) return { ok: false, message: 'cannot find this travel' };
      console.log(travel.planId);
      const plan = await this.planRepository.showPlan(travel.planId);
      console.log(plan);
      if (plan.userId != req.user['sub'])
        return { ok: false, error: 'you can not update this travel' };
      await this.travelRespository.updateTravel(travelId, {
        ...travel,
        clear: !travel.clear,
      });
      return { ok: true, message: 'update travel to clear' };
    } catch (error) {
      return { ok: false, error: 'failed to update travel' };
    }
  }

  async updateTravelRandomDes(
    travelId: number,
    req: Request,
  ): Promise<BasicOutput> {
    try {
      const travel = await this.travelRespository.showTravel(travelId);
      if (!travel) return { ok: false, message: 'cannot find this travel' };
      const plan = await this.planRepository.showPlan(travel.planId);
      if (plan.userId != req.user['sub'])
        return { ok: false, message: 'you can not update this travel' };
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

  async updateTravelByDestinationId(
    travelId: number,
    destinationId: number,
    req: Request,
  ) {
    try {
      const destination = await this.destinaitonRespoeitory.showDestinationById(
        destinationId,
      );
      if (!destination)
        return { ok: false, error: 'not found this destination' };

      const travel = await this.travelRespository.showTravel(travelId);
      if (!travel) return { ok: false, error: 'not found this travel' };
      const plan = await this.planRepository.showPlan(travel.planId);
      if (plan.userId != req.user['sub'])
        return { ok: false, message: 'you can not update this travel' };

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

  async addTravelByDestinationId(
    planId,
    destinationId,
    req: Request,
  ): Promise<AddTraveOutPut> {
    try {
      const plan = await this.planRepository.showPlan(planId);
      if (!plan) return { ok: false, message: 'this plan not found' };
      if (plan.userId != req.user['sub'])
        return { ok: false, message: 'you can not add travel in this plan' };
      const startDay = new Date(); // 여행 몇번째 날 인지

      const createTravelInput: CreateTravelInput = {
        startDay,
        planId: plan.id,
        destinationId,
      };
      const travel = await this.travelRespository.creatTravel(
        createTravelInput,
      );
      if (!travel) throwError;
      return { ok: true, travel };
    } catch (error) {
      return { ok: false, message: 'failed to add travel' };
    }
  }

  async addRandomTravel(
    addRandomTravelInput: AddRandomTravelInput,
    req: Request,
  ): Promise<AddRandomTravelOutput> {
    try {
      //여행 계획 플랜 가져오기
      const plan = await this.planRepository.showPlan(
        addRandomTravelInput.planId,
      );
      if (plan.userId != req.user['sub'])
        return { ok: false, message: 'you cannot add travel' };
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

  async createTravelPerDay(
    createRandomPlanInput: CreateRandomPlanInput,
    planId,
    dayPerDes,
    i,
  ) {
    const startDay = new Date(createRandomPlanInput.start);
    startDay.setDate(startDay.getDate() + i);
    const travels = [];
    for (let j = 0; j < 2; j++) {
      const createTravelInput: CreateTravelInput = {
        startDay,
        planId: planId,
        destinationId: dayPerDes[j].id,
      };

      const travel = await this.travelRespository.creatTravel(
        createTravelInput,
      );
      travels.push(travel);
    }
    return travels;
  }
}
