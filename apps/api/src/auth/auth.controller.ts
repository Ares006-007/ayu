import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { SwitchWorkspaceDto } from './dto/switch-workspace.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { AuthContextService } from './services/auth-context.service.js';
import { WorkspaceResolverService } from './services/workspace-resolver.service.js';
import {
  setAuthCookies,
  clearAuthCookies,
  setWorkspaceCookie,
  parseWorkspaceCookie,
} from './utils/cookie.util.js';
import type { AuthenticatedUser } from './types.js';

function requestMeta(request: Request) {
  return {
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
  };
}

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authContextService: AuthContextService,
    private readonly workspaceResolver: WorkspaceResolverService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
      requestMeta(request),
    );
    const tokens = await this.authService.login(user, requestMeta(request));

    setAuthCookies(response, tokens.access_token, tokens.refresh_token);

    const resolved = await this.workspaceResolver.resolveForUser(user.id);
    if (resolved.defaultWorkspace) {
      const ws = resolved.workspaces.find((w) => w.type === resolved.defaultWorkspace);
      setWorkspaceCookie(response, resolved.defaultWorkspace, ws?.organizationId);
    }

    const me = await this.authContextService.buildCurrentUserResponse(
      user.id,
      resolved.defaultWorkspace,
      resolved.workspaces.find((w) => w.type === resolved.defaultWorkspace)?.organizationId,
    );

    return me;
  }

  @Post('firebase-login')
  @HttpCode(HttpStatus.OK)
  async firebaseLogin(
    @Body('idToken') idToken: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const user = await this.authService.validateFirebaseUser(idToken, requestMeta(request));
    const tokens = await this.authService.login(user, requestMeta(request));

    setAuthCookies(response, tokens.access_token, tokens.refresh_token);

    const resolved = await this.workspaceResolver.resolveForUser(user.id);
    if (resolved.defaultWorkspace) {
      const ws = resolved.workspaces.find((w) => w.type === resolved.defaultWorkspace);
      setWorkspaceCookie(response, resolved.defaultWorkspace, ws?.organizationId);
    }

    return this.authContextService.buildCurrentUserResponse(
      user.id,
      resolved.defaultWorkspace,
      resolved.workspaces.find((w) => w.type === resolved.defaultWorkspace)?.organizationId,
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) {
      clearAuthCookies(response);
      return { message: 'Session expired' };
    }

    const tokens = await this.authService.refreshSession(refreshToken, requestMeta(request));
    setAuthCookies(response, tokens.access_token, tokens.refresh_token);
    return { message: 'Session refreshed' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() request: Request,
  ) {
    await this.authService.requestPasswordReset(dto.email, requestMeta(request));
    return {
      message:
        'If an account exists for that email, password reset instructions have been sent.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() request: Request,
  ) {
    await this.authService.resetPassword(dto.token, dto.password, requestMeta(request));
    return { message: 'Password has been reset. Sign in with your new password.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('workspace')
  @HttpCode(HttpStatus.OK)
  async switchWorkspace(
    @Body() dto: SwitchWorkspaceDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.authService.switchWorkspace(
      user.userId,
      dto.workspace,
      dto.organizationId,
      requestMeta(request),
    );

    setWorkspaceCookie(response, dto.workspace, dto.organizationId);

    return this.authContextService.buildCurrentUserResponse(
      user.userId,
      dto.workspace,
      dto.organizationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const refreshToken = request.cookies?.refresh_token;
    if (refreshToken) {
      await this.authService.logout(user.userId, refreshToken, requestMeta(request));
    }

    clearAuthCookies(response);
    return { message: 'Signed out successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.authService.logoutAll(user.userId, requestMeta(request));
    clearAuthCookies(response);
    return { message: 'Signed out from all sessions.' };
  }
}
