import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { CreateCommCommentInput, CreateCommCommentOutput } from '../dtos/community/create-commComment.dto';
import { CommCommentsService } from '../services/commComments.service';
import { Request } from 'express';

@Controller('commComments')
export class commCommentsController {
  constructor(private commCommentsService: CommCommentsService) {}

  @Get('/')
  showCommComments() {
    return this.commCommentsService.showComments1();
  }

  @Get('/asdf')
  findByUserOne1(@Query('id') id: number) {
    return this.commCommentsService.showComments1();
  }

  // 댓글쓰기
  @UseGuards(AccessTokenGuard)
  @Post()
  createComment(
    @Body() createCommCommentInput: CreateCommCommentInput,
    @Req() req: Request,
  ): Promise<CreateCommCommentOutput> {
    console.log('req.user', req.user);
    return this.commCommentsService.createComment(createCommCommentInput, req.user);
  }

  // post별 댓글 보기
  @Get('/:postId')
  showComments(@Param('postId') postId: number) {
    return this.commCommentsService.showComments(postId);
  }

  // 댓글 수정
  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  updateComment(@Param('id') commentId: number, @Body() updateComment: CreateCommCommentInput, @Req() req: Request) {
    return this.commCommentsService.updateComment(commentId, updateComment, req.user);
  }

  // 댓글 삭제
  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  DeleteCommentOuput(@Param('id') commentId: number, @Req() req: Request) {
    return this.commCommentsService.deleteComment(commentId, req.user);
  }
}
