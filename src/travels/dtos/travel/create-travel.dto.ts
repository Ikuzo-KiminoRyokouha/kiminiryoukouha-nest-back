import { PickType } from '@nestjs/mapped-types';
import { Travel } from '../../../travels/entities/travel.entity';

export class CreateTravelInput extends PickType(Travel, [
  'startDay',
  'planId',
  'destinationId',
  'exrating',
]) {}
