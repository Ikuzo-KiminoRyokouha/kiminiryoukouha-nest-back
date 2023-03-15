import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { CreatePlanInput, CreatePlanOutput } from './create-plan.dto';

export class CreateRandomPlanInput extends OmitType(CreatePlanInput,  [
  'destination',
]) {
}


//여기를 고쳐야할거같은데 

export class CreateRandomPlanInput1 extends OmitType(CreatePlanInput,[
  'destination'
] as const)
{
  @IsString()
  areacode:string;

  @IsString()
  sigungucode:string
 
}


export class CreateRandomPlanOutput extends CreatePlanOutput {
  'plan'?;
}
