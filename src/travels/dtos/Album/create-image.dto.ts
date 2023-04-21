import { IsOptional, IsString } from 'class-validator';

export class CreateImageInput {
  @IsString()
  planId: string;

  @IsString()
  destinationId: string;

  @IsString()
  @IsOptional()
  titile?: string;

  @IsString()
  @IsOptional()
  mapx: string;

  @IsString()
  @IsOptional()
  mapy: string;
}
