import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from 'src/users/dtos/create-user.dto';
import { UserRespository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
// import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

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
        return { ok: false, error: 'this nickname already exists' };

      // Hash password
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.usersRepository.createUser(
        createUserDto.email,
        hash,
        createUserDto.role,
        createUserDto.nickname,
      );
      const tokens = await this.getTokens(newUser.id + '', newUser.email);
      await this.updateRefreshToken(newUser.id + '', tokens.refreshToken);
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
      return { accessToken: tokens.accessToken };
    } catch (error) {
      return { ok: false, error: 'failed to create user' };
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
      const tokens = await this.getTokens(user.id + '', user.email);
      await this.updateRefreshToken(user.id + '', tokens.refreshToken);
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
      return { accessToken: tokens.accessToken };
    } catch (error) {
      return { ok: false, error: 'failed to sign in' };
    }
  }

  async logout(userId: string) {
    return this.usersRepository.updateRefreshToken(userId, {
      refreshToken: null,
    });
  }

  // hashData(data: string) {
  //   return argon2.hash(data);
  // }

  async updateAccessToken(req: Request) {
    const verifyedUser = this.jwtService.verify(req.cookies.refresh_token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersRepository.findOneBy({ id: verifyedUser.sub });
    return {
      accessToken: await this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.nickname,
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

  async getTokens(userId: string, username: string) {
    // console.log('gettoken');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
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
