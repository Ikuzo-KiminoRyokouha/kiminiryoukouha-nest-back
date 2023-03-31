import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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

  // @Get('/asdf/:id')
  // findByUserOne2(@Param('id') id: number) {
  //   return this.commCommentsService.test1(id);
  // }

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

  @Get('/asdf/:postId')
  showComments(@Param('postId') postId: number) {
    return this.commCommentsService.showComments(postId);
  }
}
