import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CreateUserInput } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(
    @Body() createUserInput: CreateUserInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signUp(createUserInput, res);
  }

  @Post('signin')
  signin(@Body() data: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(data, res);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.authService.logout(req.user['sub'], res);
  }

  @Get('token/refresh')
  restoreToken(@Req() req: Request) {
    return this.authService.updateAccessToken(req);
  }
}
