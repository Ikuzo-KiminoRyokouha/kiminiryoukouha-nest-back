import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { CustomRepository } from 'src/repositories/custom-repository.decorater';
import { UserRespository } from 'src/users/repositories/users.repository';
import { Repository } from 'typeorm';
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
    createPlanInput: CreatePlanInput | CreateRandomPlanInput,
  ): Promise<Plan> {
    try {
      // const thisUser = await this.userRepository.findOne({
      //   where: { id: user.sub },
      // });
      const plan = await this.planRepository.save(
        this.planRepository.create({
          ...createPlanInput,
          // users: [thisUser],
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
          'plan.totalCost',
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

  async showPlans(page) {
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
