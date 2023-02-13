import { IsString } from 'class-validator';

export class UpdateDescriptionInput {
  @IsString()
  description: string;
}
