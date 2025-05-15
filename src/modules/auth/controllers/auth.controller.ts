import { Controller, Post, Body, ValidationPipe, UsePipes, Res, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto, LoginUserDto } from '../../users/dtos/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(createUserDto);
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return { message: 'Registration successful', user: result.user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginUserDto);
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return { message: 'Login successful' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('access_token', '', { 
        httpOnly: true, 
        sameSite: 'lax',
        expires: new Date(0) 
    });
    return { message: 'Logout successful' };
  }
} 