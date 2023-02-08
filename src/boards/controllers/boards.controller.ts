import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { BoardsService } from '../services/boards.service';
import {
  CreateBoardInput,
  CreateBoardOutput,
} from '../dtos/board/create-board.dto';
import { DeleteBoardOuput } from '../dtos/board/delete-board.dto';
import { ShowBoardOutput } from '../dtos/board/show-board.dto';
import { ShowBoardsOutput } from '../dtos/board/show-boards.dto';
import {
  UpdateBoardInput,
  UpdateBoardOutput,
} from '../dtos/board/update-board.dto';

@Controller('board')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  createBoard(
    @Body() createBoardInput: CreateBoardInput,
    @Req() req: Request,
  ): Promise<CreateBoardOutput> {
    return this.boardService.createBoard(createBoardInput, req.user);
  }

  @Get('/:id')
  showBoard(@Param('id') boardId: number): Promise<ShowBoardOutput> {
    return this.boardService.showBoard(boardId);
  }

  @Get('/all/:page')
  showBoards(@Param('page') page: number): Promise<ShowBoardsOutput> {
    return this.boardService.showBoards(page);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  updateBoard(
    @Param('id') boardId: number,
    @Body() updateBoard: UpdateBoardInput,
    @Req() req: Request,
  ): Promise<UpdateBoardOutput> {
    return this.boardService.updateBoard(boardId, updateBoard, req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  deleteBoard(
    @Param('id') boardId: number,
    @Req() req: Request,
  ): Promise<DeleteBoardOuput> {
    return this.boardService.deleteBoard(boardId, req.user);
  }

  @Get('/search/:searchItem/:page')
  searchedBoards(
    @Param('searchItem') searchItem: string,
    @Param('page') page: number,
  ): Promise<DeleteBoardOuput> {
    return this.boardService.searchedBoards(searchItem, page);
  }

  // @UseGuards(AccessTokenGuard)
  // @Get('/my/deleted/:page')
  // showDeletedBoards(
  //   @Param('page') page: number,
  //   @Req() req: Request,
  // ): Promise<DeleteBoardOuput> {
  //   return this.boardService.showDeletedBoards(page, req.user);
  // }
}
