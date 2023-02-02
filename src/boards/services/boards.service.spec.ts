import { Test } from '@nestjs/testing';
import { BoardsRepository } from '../repositories/boards.repository';

describe('BoardService', () => {
  let boardRepository: BoardsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BoardsRepository],
    }).compile();
    boardRepository = moduleRef.get<BoardsRepository>(BoardsRepository);
  });
});
