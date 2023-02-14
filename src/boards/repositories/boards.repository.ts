import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomRepository } from '../../repositories/custom-repository.decorater';
import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity';

@Injectable()
@CustomRepository(Board)
export class BoardsRepository {
  constructor(
    @InjectRepository(Board) private readonly boardRepoitory: Repository<Board>,
  ) {}

  async createBoard({ title, content, secret }, userId) {
    try {
      const board = await this.boardRepoitory.save(
        this.boardRepoitory.create({
          title,
          content,
          secret,
          user: userId,
        }),
      );
      console.log(board);
      return true;
    } catch (error) {
      return false;
    }
  }

  async showBoard(boardId) {
    try {
      const board = await this.boardRepoitory
        .createQueryBuilder('board')
        .select([
          'board.id',
          'board.title',
          'board.content',
          'board.secret',
          'board.complete',
          'board.createdAt',
          'user.email',
          'user.id',
          'user.nickname',
        ])
        .where('board.id = :boardId', { boardId: boardId })
        .leftJoin('board.user', 'user')
        .getOne();

      return board;
    } catch (error) {
      return null;
    }
  }

  async showBoards(page) {
    try {
      const tempBoards = await this.boardRepoitory
        .createQueryBuilder('board')
        .select([
          'board.id',
          'board.title',
          'board.content',
          'board.secret',
          'board.complete',
          'board.createdAt',
          'user.email',
          'user.nickname',
        ])
        .leftJoin('board.user', 'user')
        .skip((page - 1) * 6)
        .take(6)
        .getManyAndCount();
      const boards = tempBoards[0];
      const count = tempBoards[1];
      return {
        boards,
        pages: Math.ceil(count / 6),
      };
    } catch (e) {
      return { boards: [] };
    }
  }

  async updateBoard(boardId, updateBoardInput) {
    try {
      await this.boardRepoitory.save([
        {
          id: boardId,
          ...updateBoardInput,
        },
      ]);
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteBaord(boardId) {
    try {
      await this.boardRepoitory.softDelete({ id: boardId });
      return true;
    } catch (error) {
      return false;
    }
  }

  async searchedBoards(searchedItem, page) {
    try {
      const tempBoards = await this.boardRepoitory
        .createQueryBuilder('board')
        .select([
          'board.id',
          'board.title',
          'board.content',
          'board.secret',
          'board.complete',
          'board.createdAt',
          'user.email',
          'user.nickname',
        ])
        .where('board.title LIKE :searchedItem', {
          searchedItem: `%${searchedItem}%`,
        })
        .leftJoin('board.user', 'user')
        .skip((page - 1) * 6)
        .take(6)
        .getManyAndCount();
      console.log(tempBoards);
      const boards = tempBoards[0];
      const count = tempBoards[1];
      return {
        boards,
        pages: Math.ceil(count / 6),
      };
    } catch (e) {
      return { boards: [] };
    }
  }

  async showDeletedBoards(userId, page) {
    try {
      console.log(userId);
      const board = await this.boardRepoitory.find({
        where: { user: userId.sub },
        withDeleted: false,
      });
      console.log(board);
      const [boards, totalResults] = await this.boardRepoitory.findAndCount({
        where: { user: userId },
        withDeleted: true,
        skip: (page - 1) * 6,
        take: 6,
      });
      return {
        boards,
        pages: Math.ceil(totalResults / 6),
      };
    } catch (error) {
      return { boards: [] };
    }
  }

  async restoreBoards(boardId) {
    try {
      await this.boardRepoitory.restore(boardId);
      return true;
    } catch (e) {
      return false;
    }
  }
}
