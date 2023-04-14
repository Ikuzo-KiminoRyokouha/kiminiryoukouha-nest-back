import { IsOptional, IsString } from 'class-validator';

export class CreateImageInput {
  @IsString()
  planId: string;

  @IsString()
  @IsOptional()
  titile?: string;
}
