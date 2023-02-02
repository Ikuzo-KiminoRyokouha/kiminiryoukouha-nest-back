import { Controller } from '@nestjs/common';
import { CommunityService } from '../services';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}
}
