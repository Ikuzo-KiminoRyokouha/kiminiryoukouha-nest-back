import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AlbumService } from '../services/album.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageInput } from '../dtos/Album/create-image.dto';
import { BasicOutput } from 'src/common/dtos/output.dto';
import { ShowImagesOutput } from '../dtos/Album/show-images.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async createImage(
    @Body() createImageInput: CreateImageInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BasicOutput> {
    console.log(createImageInput);
    return await this.albumService.createImage(createImageInput, file);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:planId')
  async showAlbum(
    @Param('planId') planId: number,
    @Req() req: Request,
  ): Promise<ShowImagesOutput> {
    return this.albumService.showAlbum(planId, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Get('my/all')
  async showAlbums(@Req() req: Request) {
    return this.albumService.showAlbums(req.user['sub']);
  }
}
