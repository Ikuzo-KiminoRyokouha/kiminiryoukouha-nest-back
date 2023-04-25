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
    console.log('1');

    for (let i = 0; i < travelPeriod; i++) {
      // [ [destinationId, expectedRating1], [destinationId2, expectedRating2] ]
      console.log(createPersonPlanInput.tag[i + 1]);
      const rawItem = await axios
        .post(process.env.DJANGO_API + 'destinations', {
          data: {
            userId: req.user['sub'],
            tag: createPersonPlanInput.tag[i + 1],
            start: 0,
            end: 2,
          },
        })
        .then((res) => {
          return res.data;
        });
      console.log('111');
      const splitItem = rawItem.split(')(');
      const destinations = splitItem.map((item) => {
        const newItem = item.replace(/[()]/g, '').split(',');
        return [parseInt(newItem[0]), parseFloat(newItem[1])];
      });
      console.log('2');

      const travel = await this.travelService.createTravelPerDay(
        createPersonPlanInput,
        plan.id,
        [{ id: destinations[0][0] }, { id: destinations[1][0] }],
        i,
      );
      console.log('3');

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
        //원하는 번호를 불러옴
        createCopyPlanInput.planId,
      );
      if (!existPlan) return { ok: false, message: 'not found exist plan' }; //없으면 에러메세지를 보내줌

      const travelPeriod = subtractDate(existPlan.end, existPlan.start); // 총기간
      const startDay = new Date(createCopyPlanInput.start); //시작 날짜
      const endDay = new Date(
        startDay.setDate(startDay.getDate() + travelPeriod - 1), //끝 날짜
      );
      const copyPlan = await this.planRepository.copyPlan(
        //얘는 플랜아이디 plan에 id를받아와서 맨 높은놈바로위에꺼를 planid로만들고 넣어준 날짜로 바꿔줌
        existPlan,
        createCopyPlanInput.start,
        endDay,
      );

      if (!copyPlan) throws; //위에서못받아오면
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

  async todayPlan(userId) {
    try {
      const date = new Date();
      const year = date.getFullYear(); // 년도
      const month = date.getMonth() + 1; // 월 (0부터 시작하므로 +1 필요)
      const day = date.getDate(); // 일

      const koreanDate: Date = new Date(year, month - 1, day);
      const koreanTimezoneOffset: number = 540;

      koreanDate.setMinutes(koreanDate.getMinutes() + koreanTimezoneOffset);

      const plan = await this.planRepository.todayPlan(userId, koreanDate);
      return {
        ok: true,
        plan,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'failed to find plan',
      };
    }
  }
}
