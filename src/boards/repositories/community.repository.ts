import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from '../entities';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from '../../repositories/custom-repository.decorater';

@Injectable()
@CustomRepository(Community)
export class CommunityRepository {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
  ) {}
}
