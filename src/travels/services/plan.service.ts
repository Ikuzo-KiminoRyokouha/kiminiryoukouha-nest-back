import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import {
  CreateRandomPlanInput,
  CreateRandomPlanOutput,
} from '../dtos/plan/craete-random-plan.dto';
import {
  CreatePlanInput,
  CreatePlanOutput,
} from '../dtos/plan/create-plan.dto';
import { DeletePlanOutput } from '../dtos/plan/delete-plan.dto';
import { ShowPlanOutput } from '../dtos/plan/show-plan.dto';
import { ShowPlansOutput } from '../dtos/plan/show-plans.dto';
import { CreateTravelInput } from '../dtos/travel/create-travel.dto';
import { Destination } from '../entities/destination.entity';
import { DestinationRepository } from '../repositories/destination.repository';
import { planRepository } from '../repositories/plan.repository';
import { TravelRepository } from '../repositories/travel.repository';
import { TravelService } from './travel.service';
import { CreateCopyPlanInput } from '../dtos/plan/create-copy-plan.dto';
import { BasicOutput } from '../../common/dtos/output.dto';
import { throws } from 'assert';
import { isSameDate, subtractDate } from '../..//util/dateCal';
import axios from 'axios';

@Injectable()
export class PlanService {
  constructor(
    private planRepository: planRepository,
    private destinationRepository: DestinationRepository,
    private travelRepositoy: TravelRepository,
    private travelService: TravelService,
  ) {}

  async createPersonalityPlan(
    createPersonPlanInput: CreateRandomPlanInput,
    req: Request,
  ): Promise<CreateRandomPlanOutput> {
    if (createPersonPlanInput.title == null) {
      createPersonPlanInput.title = `${createPersonPlanInput.city}여행 ${createPersonPlanInput.start} 시작`;
    }
    //여행 계획 CREATE
    const plan = await this.planRepository.createPlan(
      createPersonPlanInput,
      req.user['sub'],
    );
    if (!plan) throwError;
    // // 출발날짜 string -> date
    // //여행기간  두 날의 차이 / 단위 ms(천분의 1초) / 나누기 하루를 초로 낸것에 1000을 곱
    const travelPeriod =
      (new Date(createPersonPlanInput.end).getTime() -
        new Date(createPersonPlanInput.start).getTime()) /
        (1000 * 60 * 60 * 24) +
      1;
    for (let i = 0; i < travelPeriod; i++) {
      // [ [destinationId, expectedRating1], [destinationId2, expectedRating2] ]
      const rawItem = await axios
        .post(process.env.DJANGO_API + 'destinations', {
          data: {
            userId: req.user['sub'],
            tag: createPersonPlanInput.tag[i],
            start: 0,
            end: 2,
          },
        })
        .then((res) => {
          return res.data;
        });
      const splitItem = rawItem.split(')(');
      const destinations = splitItem.map((item) => {
        const newItem = item.replace(/[()]/g, '').split(',');
        return [parseInt(newItem[0]), parseFloat(newItem[1])];
      });

      const travel = await this.travelService.createTravelPerDay(
        createPersonPlanInput,
        plan.id,
        [{ id: destinations[0][0] }, { id: destinations[1][0] }],
        i,
      );
      if (!travel) return;
    }
    const tempPlan = await this.planRepository.showPlan(plan.id);
    return {
      ok: true,
      message: 'create plan',
      plan: tempPlan,
    };
  }

  async createCopyPlan(
    createCopyPlanInput: CreateCopyPlanInput,
  ): Promise<BasicOutput> {
    try {
      const existPlan = await this.planRepository.showPlan(
        createCopyPlanInput.planId,
      );
      if (!existPlan) return { ok: false, message: 'not found exist plan' };

      const travelPeriod = subtractDate(existPlan.end, existPlan.start);
      const startDay = new Date(createCopyPlanInput.start);
      const endDay = new Date(
        startDay.setDate(startDay.getDate() + travelPeriod - 1),
      );
      const copyPlan = await this.planRepository.copyPlan(
        existPlan,
        createCopyPlanInput.start,
        endDay,
      );

      if (!copyPlan) throws;
      const travels = await this.travelRepositoy.showTravelsByPlanId(
        createCopyPlanInput.planId,
      );

      let flag = travels[0].startDay;
      let travelStartDay = new Date(startDay);

      for (let i = 0; i < travels.length; i++) {
        if (!isSameDate(flag, travels[i].startDay)) {
          travelStartDay = new Date(startDay.setDate(startDay.getDate() + 1));
          flag = travels[i].startDay;
        }
        const travel = await this.travelRepositoy.copyTravel(
          travels[i],
          travelStartDay,
          copyPlan.id,
        );
        if (!travel) throwError;
      }

      return { ok: true, message: 'success to copy plan' };
    } catch (error) {
      return { ok: false, message: 'fail to copy plan' };
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

  async showPlans(page: number, req: Request): Promise<ShowPlansOutput> {
    try {
      const { plans, pages } = await this.planRepository.showPlans(
        page,
        req.user['sub'],
      );
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

  async deletePlan(pageId: number, req: Request): Promise<DeletePlanOutput> {
    try {
      // check user
      const plan = await this.planRepository.showPlan(pageId);
      console.log(plan, req.user['sub']);
      if (plan.userId != req.user['sub'])
        return { ok: false, message: 'you can not delete this plan' };

      // delete plan
      const deletePlan = await this.planRepository.deletePlan(pageId);
      if (!deletePlan) return { ok: false, error: 'failed to delete plan' };
      if (deletePlan.affected == 0)
        return { ok: false, message: 'not found this plan' };
      return { ok: true, message: 'delete plan' };
    } catch (error) {
      {
        return { ok: false, message: 'failed to delete plan' };
      }
    }
  }

  async createPlan(
    createPlanInput: CreatePlanInput,
    req: Request,
  ): Promise<CreatePlanOutput> {
    try {
      //계획 생성
      const plan = await this.planRepository.createPlan(
        createPlanInput,
        req.user['sub'],
      );
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
            await this.destinationRepository.showDestinationById(
              Object.values(destination)[0],
            );
          if (!checkDestination)
            return { ok: false, error: 'failed to create plan' };
          const createTravelInput: CreateTravelInput = {
            startDay,
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
  async createRandomPlan(
    createRandomPlanInput: CreateRandomPlanInput,
    req: Request,
  ): Promise<CreateRandomPlanOutput> {
    try {
      console.log('ho');
      //여행 제목 설정
      if (createRandomPlanInput.title == null) {
        createRandomPlanInput.title = `${createRandomPlanInput.city}여행 ${createRandomPlanInput.start} 시작`;
      }

      //여행 계획 CREATE
      const plan = await this.planRepository.createPlan(
        createRandomPlanInput,
        req.user['sub'],
      );
      if (!plan) throwError;
      //출발날짜 string -> date
      // //여행기간  두 날의 차이 / 단위 ms(천분의 1초) / 나누기 하루를 초로 낸것에 1000을 곱
      const travelPeriod =
        (new Date(createRandomPlanInput.end).getTime() -
          new Date(createRandomPlanInput.start).getTime()) /
          (1000 * 60 * 60 * 24) +
        1;

      const checkDestinationArr: number[] = [0];

      //여행지 생성
      for (let i = 0; i < travelPeriod; i++) {
        //태그에 따른 여행지 찾기
        const tempDayPerDesArr: Destination[] = [];
        for (let j = 0; j < 2; j++) {
          const dayPerDes = await this.destinationRepository.getRaondomDes(
            createRandomPlanInput.tag[i],
            checkDestinationArr,
          );
          if (dayPerDes === null)
            return { ok: false, message: `this city dosen't have ~~` };
          checkDestinationArr.push(dayPerDes.id);
          tempDayPerDesArr.push(dayPerDes);
        }

        const travel = await this.travelService.createTravelPerDay(
          createRandomPlanInput,
          plan.id,
          tempDayPerDesArr,
          i,
        );
        if (!travel) return { ok: false, error: 'failed to create plan' };
      }
      const tempPlan = await this.planRepository.showPlan(plan.id);
      return {
        ok: true,
        message: 'create plan',
        plan: tempPlan,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'failed to create plan',
      };
    }
  }
}
