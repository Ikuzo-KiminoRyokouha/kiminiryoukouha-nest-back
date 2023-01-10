import { Injectable } from '@nestjs/common';
import {
  CreateBoardInput,
  CreateBoardOutput,
} from '../dtos/board/create-board.dto';
import { BoardsRepository } from './boards.repository';
import { ShowBoardOutput } from '../dtos/board/show-board.dto';
import {
  UpdateBoardInput,
  UpdateBoardOutput,
} from '../dtos/board/update-board.dto';
import { ShowBoardsOutput } from '../dtos/board/show-boards.dto';
import { DeleteBoardOuput } from '../dtos/board/delete-board.dto';

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardsRepository) {}
  async createBoard(
    createBoardInput: CreateBoardInput,
    user,
  ): Promise<CreateBoardOutput> {
    try {
      await this.boardRepository.createBoard(
        {
          ...createBoardInput,
        },
        user.sub,
      );
      return {
        ok: true,
        message: 'create board',
      };
    } catch (error) {
      return {
        ok: false,
        error: 'failed to create board',
      };
    }
  }

  async showBoard(boardId: number): Promise<ShowBoardOutput> {
    try {
      const board = await this.boardRepository.showBoard(boardId);
      if (!board) {
        return {
          ok: false,
          error: 'board not found',
        };
      }
      return {
        ok: true,
        board,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'not found any board',
      };
    }
  }

  async showBoards(page: number): Promise<ShowBoardsOutput> {
    try {
      const { boards, pages } = await this.boardRepository.showBoards(page);
      if (!boards[0]) {
        return {
          ok: false,
          message: 'not found any boards',
        };
      }
      return {
        ok: true,
        pages,
        boards,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'failed to show boards',
      };
    }
  }

  async updateBoard(
    boardId: number,
    updateBoardInput: UpdateBoardInput,
    user,
  ): Promise<UpdateBoardOutput> {
    try {
      const board = await this.boardRepository.showBoard(boardId);
      if (!board) {
        return {
          ok: false,
          error: 'board not found',
        };
      }
      if (user.sub != board.id) {
        return {
          ok: false,
          error: 'you can not update this board',
        };
      }
      const check = await this.boardRepository.updateBoard(
        boardId,
        updateBoardInput,
      );
      if (!check) {
        return {
          ok: false,
          error: 'failed to update board',
        };
      }
      return {
        ok: true,
        message: 'update board',
      };
    } catch (error) {
      return {
        ok: false,
        error: 'failed to update board',
      };
    }
  }

  async deleteBoard(boardId: number, user): Promise<DeleteBoardOuput> {
    try {
      const board = await this.boardRepository.showBoard(boardId);
      console.log('kk');
      console.log(board);
      if (!board) {
        return {
          ok: false,
          error: 'board not found',
        };
      }
      console.log(user.sub);
      if (user.sub != board.user.id) {
        return {
          ok: false,
          error: 'you can not update this board',
        };
      }
      const check = await this.boardRepository.deleteBaord(boardId);
      if (!check) {
        return {
          ok: false,
          error: 'failed to delete board',
        };
      }
      return {
        ok: true,
        message: 'delete board',
      };
    } catch (e) {
      return {
        ok: false,
        error: 'failed to delete board',
      };
    }
  }

  async searchedBoards(selectedItem: string, page: number) {
    try {
      const { boards, pages } = await this.boardRepository.searchedBoards(
        selectedItem,
        page,
      );
      if (!boards[0]) {
        return {
          ok: false,
          error: 'board not found',
        };
      }
      return {
        ok: true,
        pages,
        boards,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'board not found',
      };
    }
  }

  // async showDeletedBoards(page, user): Promise<ShowBoardsOutput> {
  //   try {
  //     const { boards, pages } = await this.boardRepository.showDeletedBoards(
  //       user.sub,
  //       page,
  //     );
  //     if (!boards[0]) {
  //       return {
  //         ok: false,
  //         error: 'board not found',
  //       };
  //     }
  //     if (user.sub != boards[0].id) {
  //       return {
  //         ok: false,
  //         error: 'you can not update this board',
  //       };
  //     }
  //     return {
  //       ok: true,
  //       pages,
  //       boards,
  //     };
  //   } catch (e) {
  //     return {
  //       ok: false,
  //       error: 'boards not found',
  //     };
  //   }
  // }
}
