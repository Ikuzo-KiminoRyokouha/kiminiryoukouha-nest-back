import { IsNumber } from 'class-validator';
import { Community } from '../../../boards/entities';

export class DeleteCommunityInput {
  @IsNumber()
  id: number;
}

export class DeleteCommunityOutput {}
