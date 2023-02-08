import { PickType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { Community } from 'src/boards/entities';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class ShowCommunityInput {
  @IsString()
  limit: number;
  @IsString()
  offset: number;
}

export class ShowCommunityOutput extends Promise<Array<Community>> {}
