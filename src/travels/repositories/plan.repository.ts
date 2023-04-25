import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { CustomRepository } from '../../repositories/custom-repository.decorater';
import { UserRespository } from '../../users/repositories/users.repository';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateRandomPlanInput } from '../dtos/plan/craete-random-plan.dto';
import { CreatePlanInput } from '../dtos/plan/create-plan.dto';
import { ShowPlanOutput } from '../dtos/plan/show-plan.dto';
import { Plan } from '../entities/plan.entity';
import { Travel } from '../entities/travel.entity';

@Injectable()
@CustomRepository(Plan)
export class planRepository {
  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    private readonly userRepository: UserRespository,
  ) {}

  async createPlan(
    createPlanInput: CreateRandomPlanInput,
    userId,
  ): Promise<Plan> {
    try {
      const plan = await this.planRepository.save(
        this.planRepository.create({
          ...createPlanInput,
          start: new Date(createPlanInput.start),
          end: new Date(createPlanInput.end),
          userId,
        }),
      );
      return plan;
    } catch (error) {
      throws;
    }
  }
  async createRandomPlan() {
    try {
      const plan = await this.planRepository.save(
        this.planRepository.create({}),
      );
      return plan;
    } catch (e) {
      throws;
    }
  }

  async getMaxId() {
    try {
      const maxId = await this.planRepository
        .createQueryBuilder('plan')
        .select('MAX(plan.id) AS max')
        .getRawOne();
      return maxId;
    } catch (error) {}
  }

  async copyPlan(plan: Plan, start, end) {
    try {
      const maxId = await this.getMaxId();
      const copyPlan = await this.planRepository.save({
        ...plan,
        id: maxId.max + 1,
        start,
        end,
      });
      return copyPlan;
    } catch (error) {
      throws;
    }
  }

  async showPlan(planId): Promise<Plan> {
    try {
      const plan = await this.planRepository
        .createQueryBuilder('plan')
        .select([
          'plan.id',
          'plan.title',
          'plan.start',
          'plan.end',
          'plan.city',
          'plan.tag',
          'plan.totalCost',
          'plan.userId',
          'plan.areacode',
          'plan.sigungucode',
          'travel.id',
          'travel.startDay',
          'destination.id',
          'destination.title',
          'destination.mapx',
          'destination.mapy',
          'destination.firstimage',
          'destination.contentid',
          'destination.contenttypeid',
        ])
        .leftJoin('plan.travels', 'travel')
        .leftJoin('travel.destination', 'destination')
        .where('plan.id = :planId', { planId })
        .orderBy('travel.startDay')
        .getOne();
      if (!plan) return null;
      return plan;
    } catch (error) {
      throws;
    }
  }

  async showPlans(page, user) {
    try {
      const tempPlans = await this.planRepository
        .createQueryBuilder('plan')
        .select([
          'plan.id',
          'plan.title',
          'plan.start',
          'plan.end',
          'plan.city',
          'plan.tag',
          'plan.totalCost',
          'travel.id',
          'travel.startDay',
          'destination.title',
          'destination.firstimage',
        ])
        .leftJoin('plan.travels', 'travel')
        .leftJoin('travel.destination', 'destination')
        .where('plan.userId = :user', { user })
        .orderBy('travel.startDay')
        .getManyAndCount();
      return {
        plans: tempPlans[0],
        pages: Math.ceil(tempPlans[1] / 6),
      };
    } catch (error) {
      throws;
    }
  }

  async updatePlan(palnId, updatePlanInput) {
    try {
      await this.planRepository.save([
        {
          id: palnId,
          ...updatePlanInput,
        },
      ]);
      return true;
    } catch (error) {
      throws;
    }
  }

  async deletePlan(planId) {
    try {
      const deletePlan = await this.planRepository.softDelete({ id: planId });
      return deletePlan;
    } catch (error) {
      throws;
    }
  }

  async todayPlan(userId, today) {
    const plan = await this.planRepository.findOne({
      // select: { id: true, totalCost: true },
      where: {
        userId,
        start: LessThanOrEqual(today),
        end: MoreThanOrEqual(today),
      },
    });
    console.log(plan);
    return plan;
  }

  // async searchedPlan(searchedItem, page) {
  //   try {
  //     const [searchedPlan, totalResults] =
  //       await this.planRepository.findAndCount({
  //         where: {
  //           title: Raw((title) => `${title} ILIKE '%${searchedItem}%'`),
  //         },
  //         skip: (page - 1) * 25,
  //         take: 25,
  //       });
  //   } catch (error) {}
  // }
}
