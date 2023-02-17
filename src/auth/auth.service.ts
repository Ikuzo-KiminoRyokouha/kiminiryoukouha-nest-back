import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserInput } from '../users/dtos/create-user.dto';
import { UserRespository } from '../users/repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
// import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { sendHttpOnlyCookie } from '../util/sendCookie';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UserRespository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserInput, res: Response): Promise<any> {
    try {
      // Check if user exists
      const userExists = await this.usersRepository.existsUser(
        createUserDto.email,
      );
      if (userExists) {
        return { ok: false, error: 'this email already exists' };
      }

      const nicknameExists = await this.usersRepository.existsNickname(
        createUserDto.nickname,
      );

      if (nicknameExists)
        throw new HttpException('nickname is exist', HttpStatus.BAD_REQUEST);

      // Hash password
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.usersRepository.createUser(
        createUserDto.email,
        hash,
        createUserDto.role,
        createUserDto.nickname,
      );
      const tokens = await this.getTokens(
        String(newUser.id),
        newUser.nickname,
        newUser.email,
      );
      await this.updateRefreshToken(newUser.id + '', tokens.refreshToken);
      sendHttpOnlyCookie(res, 'refresh_token', tokens.refreshToken);
      return { accessToken: tokens.accessToken };
    } catch (error) {
      throw new HttpException("Can't Create", HttpStatus.BAD_REQUEST);
    }
  }

  async signIn(data: AuthDto, res: Response) {
    try {
      // Check if user exists
      const user = await this.usersRepository.existsUser(data.email);
      if (!user) throw new BadRequestException('User does not exist');
      const passwordMatches = await bcrypt.compare(
        data.password,
        user.password,
      );

      if (!passwordMatches)
        throw new BadRequestException('Password is incorrect');
      const tokens = await this.getTokens(
        String(user.id),
        user.nickname,
        user.email,
      );
      await this.updateRefreshToken(user.id + '', tokens.refreshToken);
      sendHttpOnlyCookie(res, 'refresh_token', tokens.refreshToken);
      return { accessToken: tokens.accessToken };
    } catch (error) {
      throw new HttpException('Fail to Sign In', HttpStatus.BAD_REQUEST);
    }
  }

  async logout(userId: string, res: Response) {
    sendHttpOnlyCookie(res, 'refresh_token', undefined, { maxAge: 0 });

    return this.usersRepository.updateRefreshToken(userId, {
      refreshToken: null,
    });
  }

  // hashData(data: string) {
  //   return argon2.hash(data);
  // }

  async updateAccessToken(req: Request) {
    console.log(req.cookies);
    const verifyedUser = this.jwtService.verify(req.cookies.refresh_token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersRepository.getUser(verifyedUser['sub']);
    return {
      accessToken: await this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.nickname,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersRepository.updateRefreshToken(userId, {
      refreshToken,
    });
  }

  async getTokens(userId: string, username: string, email: string) {
    // console.log('gettoken');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
