import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomRepository } from 'src/repositories/custom-repository.decorater';
import { UserRespository } from 'src/users/users.repository';
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

  async createPlan(createPlanInput: CreatePlanInput | CreateRandomPlanInput) {
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
      return null;
    }
  }
  async createRandomPlan() {
    try {
      const plan = await this.planRepository.save(
        this.planRepository.create({}),
      );
      return plan;
    } catch (e) {
      return null;
    }
  }

  async showPlan(planId) {
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
      return plan;
    } catch (error) {
      console.log(error);
      return null;
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
      return null;
    }
  }

  async showMyPlans(page, userId) {
    try {
      const [plans, pages] = await this.planRepository.findAndCount({
        where: userId,
        skip: (page - 1) * 6,
        take: 6,
      });
      if (!plans) return null;
      return {
        plans,
        pages,
      };
    } catch (error) {
      return null;
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
      return false;
    }
  }

  async deletePlan(planId) {
    try {
      const deletePlan = await this.planRepository.softDelete({ id: planId });
      return deletePlan;
    } catch (error) {
      return false;
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
