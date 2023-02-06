import { PickType } from '@nestjs/mapped-types';
import { Community } from 'src/boards/entities';
import { BasicOutput } from 'src/common/dtos/output.dto';

export class ShowCommunityInput {
  limit: number;
  offset: number;
}

export class ShowCommunityOutput extends Promise<Array<Community>> {}
