import { Controller, Post, UseGuards, Req, Body, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtTwoFactorGuard } from './guards/jwt-2fa.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() body) {
    return this.usersService.create(body);
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('2fa/generate')
  async register2FA(@Req() req) {
    const { otpauthUrl } = await this.authService.generateTwoFactorAuthenticationSecret(req.user);

    return {
      qrCodeUrl: await this.authService.generateQrCodeDataURL(otpauthUrl)
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/turn-on')
  async turnOnTwoFactorAuthentication(@Req() req, @Body() body) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      req.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Code invalide');
    }
    await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
    return this.authService.loginWith2fa(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/authenticate')
  async authenticate(@Req() req, @Body() body) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      req.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Code invalide');
    }
    return this.authService.loginWith2fa(req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
