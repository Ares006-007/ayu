import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service.js';
import { randomBytes } from 'crypto';

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, pass);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user.id);
    
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    // In a real app, you would determine roles from the organization memberships
    // For now, defaulting to basic PATIENT role just to get a token structurally correct.
    const payload: TokenPayload = { 
      sub: user.id, 
      email: user.email,
      roles: ['PATIENT'] 
    };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m', // Short-lived access token
    });
    
    const refreshToken = randomBytes(32).toString('hex');
    // NOTE: Here you would store the refresh token in Redis mapped to the user ID
    // await this.redisService.set(`refresh_token:${user.id}:${refreshToken}`, 'valid', 'EX', 7 * 24 * 60 * 60);

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }
  
  async logout(userId: string, refreshToken: string) {
    // Revoke the specific refresh token in Redis
    // await this.redisService.del(`refresh_token:${userId}:${refreshToken}`);
    return { success: true };
  }
  
  async logoutAll(userId: string) {
    // Revoke all refresh tokens for this user in Redis
    // const keys = await this.redisService.keys(`refresh_token:${userId}:*`);
    // if (keys.length) {
    //   await this.redisService.del(keys);
    // }
    return { success: true };
  }
}
