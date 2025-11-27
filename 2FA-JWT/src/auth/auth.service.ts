import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user.id,
      isSecondFactorAuthenticated: !user.isTwoFactorAuthenticationEnabled,
    };

    return {
      access_token: this.jwtService.sign(payload),
      is_2fa_enabled: user.isTwoFactorAuthenticationEnabled
    };
  }

  async loginWith2fa(user: any) {
    const payload = {
      username: user.email,
      sub: user.id,
      isSecondFactorAuthenticated: true,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateTwoFactorAuthenticationSecret(user: any) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'FT_TRANSCENDENCE', secret);
    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
    return { secret, otpauthUrl };
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: any) {
    if (!user.twoFactorAuthenticationSecret) return false;
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
