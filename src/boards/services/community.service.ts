import { CommentsRepository } from '../repositories';

export class CommunityService {
  constructor(private readonly communityRepository: CommentsRepository) {}
}
