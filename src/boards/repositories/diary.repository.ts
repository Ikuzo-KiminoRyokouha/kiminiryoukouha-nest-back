import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from '../entities';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from '../../repositories/custom-repository.decorater';

@Injectable()
@CustomRepository(Diary)
export class DiaryRepository {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
  ) {}
}
