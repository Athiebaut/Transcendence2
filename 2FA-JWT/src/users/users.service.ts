import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hash,
      },
    });


    const { password, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorAuthenticationSecret: secret },
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorAuthenticationEnabled: true },
    });
  }
}
