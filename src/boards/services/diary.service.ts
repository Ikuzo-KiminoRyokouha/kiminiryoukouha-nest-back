import { DiaryRepository } from '../repositories';

export class DiaryService {
  constructor(private readonly diaryRepository: DiaryRepository) {}
}
