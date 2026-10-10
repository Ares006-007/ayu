import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { UsersService } from '../users/users.service.js';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    const tokens = await this.authService.login(user);

    // Set secure HttpOnly cookie for access token
    response.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set secure HttpOnly cookie for refresh token
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/v1/auth/refresh', // only sent to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        roles: ['PATIENT'] // Replace with actual roles later
      }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response, @CurrentUser() user: any) {
    const refreshToken = request.cookies['refresh_token'];
    if (refreshToken) {
      await this.authService.logout(user.userId, refreshToken);
    }

    response.clearCookie('access_token');
    response.clearCookie('refresh_token', { path: '/v1/auth/refresh' });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Res({ passthrough: true }) response: Response, @CurrentUser() user: any) {
    await this.authService.logoutAll(user.userId);
    
    response.clearCookie('access_token');
    response.clearCookie('refresh_token', { path: '/v1/auth/refresh' });

    return { message: 'Logged out from all sessions' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: any) {
    const userData = await this.usersService.findById(user.userId);
    if (!userData) {
      return null;
    }
    const { passwordHash, ...safeUserData } = userData;
    return safeUserData;
  }
}
