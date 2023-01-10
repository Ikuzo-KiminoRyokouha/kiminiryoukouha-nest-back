import { Injectable } from '@nestjs/common';
import {
  CreatePlanInput,
  CreatePlanOutput,
} from '../dtos/plan/create-plan.dto';
import { ShowPlanOutput } from '../dtos/plan/show-plan.dto';
import { ShowPlansOutput } from '../dtos/plan/show-plans.dto';
import { CreateTravelInput } from '../dtos/travel/create-travel.dto';
import { DestinationRepository } from '../repositories/destination.repository';
import { TravelRepository } from '../repositories/travel.repository';
import { planRepository } from './plan.repository';

@Injectable()
export class PlanService {
  constructor(
    private planRepository: planRepository,
    private destinationRepository: DestinationRepository,
    private travelRepositoy: TravelRepository,
  ) {}

  async createPlan(
    createPlanInput: CreatePlanInput,
  ): Promise<CreatePlanOutput> {
    try {
      const destinationStartDay = new Date(createPlanInput.start);

      //계획 생성
      const plan = await this.planRepository.createPlan(createPlanInput);
      if (!plan) return { ok: false, message: 'failed to create plan' };

      //사용자의 계획에서 여행지만 받기 ex) {"1":[{"1":"석가탑"} , {"2":"석굴암"}],"2":[{"1":"황룡사"},{"2":"다보탑"}],"3":[{"1":"첨성대"}]}
      const travel = createPlanInput.destination;

      Object.keys(travel).forEach(async (day) => {
        const startDay = new Date(createPlanInput.start); // 여행 몇번째 날 인지
        const nubmerDay = Number(day);
        startDay.setDate(startDay.getDate() + nubmerDay);
        travel[day].forEach(async (destination) => {
          const order = +Object.keys(destination)[0]; // 그 날에 갈 곳 중에 순서
          // DB에서 목적지 정보가 있는 지 확인 후 추가 or 그냥 진행
          const checkDestination =
            await this.destinationRepository.checkDestination(
              Object.values(destination)[0],
            );
          if (!checkDestination)
            return { ok: false, error: 'failed to create plan' };
          const createTravelInput: CreateTravelInput = {
            startDay,
            order,
            planId: plan.id,
            destinationId: checkDestination.id,
          };
          // 각 날자와 순서별로 여행테이블에 여행 생성
          const travel = await this.travelRepositoy.creatTravel(
            createTravelInput,
          );
          if (!travel) return { ok: false, error: 'failed to create plan' };
        });
      });

      return {
        ok: true,
        message: 'create plan',
      };
    } catch (error) {
      return {
        ok: false,
        error: 'failed to create plan',
      };
    }
  }

  async showPlan(planId: number): Promise<ShowPlanOutput> {
    try {
      const plan = await this.planRepository.showPlan(planId);
      if (!plan) return { ok: false, message: 'failed to show plan' };
      return {
        ok: true,
        plan,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'not found any plan ',
      };
    }
  }

  async showPlans(page: number): Promise<ShowPlansOutput> {
    try {
      const { plans, pages } = await this.planRepository.showPlans(page);
      if (!plans[0]) return { ok: false, message: 'not found any plan' };
      return {
        ok: true,
        plans,
        pages,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'failed to sho plans',
      };
    }
  }
}
