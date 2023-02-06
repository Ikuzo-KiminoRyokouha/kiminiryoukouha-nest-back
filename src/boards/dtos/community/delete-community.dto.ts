import { IsNumber } from 'class-validator';
import { Community } from 'src/boards/entities';

export class DeleteCommunityInput {
  @IsNumber()
  id: number;
}

export class DeleteCommunityOutput {}
