import { Controller } from '@nestjs/common';
import { DiaryService } from '../services';

@Controller('diary')
export class DiaryController {
  constructor(private diaryService: DiaryService) {}
}
