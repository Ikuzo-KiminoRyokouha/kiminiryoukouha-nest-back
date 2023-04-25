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
import { Plan } from '../entities/plan.entity';

@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  //
  @UseGuards(AccessTokenGuard)
  @Post('/personality')
  createPersonalityPlan(
    @Body() createPersonPlanInput: CreateRandomPlanInput,
    @Req() req: Request,
  ): Promise<CreatePlanOutput> {
    console.log(createPersonPlanInput);
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

  @UseGuards(AccessTokenGuard)
  @Get('/today')
  async todayPlan(@Req() req: Request): Promise<ShowPlanOutput> {
    return await this.planService.todayPlan(req.user['sub']);
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
