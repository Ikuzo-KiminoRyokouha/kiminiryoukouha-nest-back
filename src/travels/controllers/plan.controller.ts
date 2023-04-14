import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BasicOutput } from '../../common/dtos/output.dto';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import {
  CreateRandomPlanInput,
  CreateRandomPlanInput1,
  CreateRandomPlanOutput,
} from '../dtos/plan/craete-random-plan.dto';
import { CreateCopyPlanInput } from '../dtos/plan/create-copy-plan.dto';
import {
  CreatePlanInput,
  CreatePlanOutput,
} from '../dtos/plan/create-plan.dto';
import { DeletePlanOutput } from '../dtos/plan/delete-plan.dto';
import { ShowPlanOutput } from '../dtos/plan/show-plan.dto';
import { ShowPlansOutput } from '../dtos/plan/show-plans.dto';
import { PlanService } from '../services/plan.service';

@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  createPlan(
    @Body() createPlanInput: CreatePlanInput,
    @Req() req: Request,
  ): Promise<CreatePlanOutput> {
    return this.planService.createPlan(createPlanInput, req);
  }

  // @UseGuards(AccessTokenGuard)
  // @Post('/random')
  // createRandomPlan(
  //   @Body() createRandomPlanInput: CreateRandomPlanInput,
  //   @Req() req: Request,
  // ) {

  //   return this.planService.createRandomPlan(createRandomPlanInput, req);
  // }

  @UseGuards(AccessTokenGuard)
  @Post('/random/1')
  createRandomPlan1(
    @Body() createRandomPlanInput: CreateRandomPlanInput1,
    @Req() req: Request,
  ) {
    return this.planService.createRandomPlan1(createRandomPlanInput, req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/personality')
  createPersonalityPlan(
    @Body() createPersonPlanInput: CreateRandomPlanInput,
    @Req() req: Request,
  ): Promise<CreatePlanOutput> {
    return this.planService.createPersonalityPlan(createPersonPlanInput, req);
  }

  //이게 계획눌렀을때 가져오는거
  @UseGuards(AccessTokenGuard)
  @Post('/copy')
  createCopyPlan(
    @Body() createCopyPlanInput: CreateCopyPlanInput,
  ): Promise<BasicOutput> {
    return this.planService.createCopyPlan(createCopyPlanInput);
  }

  @Get('/:id')
  showPlan(@Param('id') planId: number): Promise<ShowPlanOutput> {
    return this.planService.showPlan(planId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/all/:page')
  showPlans(
    @Param('page') page: number,
    @Req() req: Request,
  ): Promise<ShowPlansOutput> {
    return this.planService.showPlans(page, req);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  deletePlan(
    @Param('id') planId: number,
    @Req() req: Request,
  ): Promise<DeletePlanOutput> {
    return this.planService.deletePlan(planId, req);
  }
}
