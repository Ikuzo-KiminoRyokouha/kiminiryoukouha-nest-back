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
import { CommentsService } from './comments.service';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from '../dtos/comment/create-comment.dto';
import { DeleteCommentOuput } from '../dtos/comment/delete-comment.dto';
import { ShowCommentsOutput } from '../dtos/comment/show-comments.dto';
import {
  UpdateCommentInput,
  updateCommentOutput,
} from '../dtos/comment/update-comment.dto';

@Controller('comment')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  createComment(
    @Body() createCommentInput: CreateCommentInput,
    @Req() req: Request,
  ): Promise<CreateCommentOutput> {
    console.log(req.user);
    return this.commentService.createComment(createCommentInput, req.user);
  }

  @Get('/:boardId')
  showComments(@Param('boardId') boardId: number): Promise<ShowCommentsOutput> {
    return this.commentService.showComments(boardId);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  updateBoard(
    @Param('id') commentId: number,
    @Body() updateComment: UpdateCommentInput,
    @Req() req: Request,
  ): Promise<updateCommentOutput> {
    return this.commentService.updateComment(
      commentId,
      updateComment,
      req.user,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  deleteComment(
    @Param('id') commentId: number,
    @Req() req: Request,
  ): Promise<DeleteCommentOuput> {
    return this.commentService.deleteComment(commentId, req.user);
  }
}
