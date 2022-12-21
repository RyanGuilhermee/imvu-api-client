import { PrismaClient, RefreshToken } from '@prisma/client';
import { BadRequest } from '@src/errors/BadRequest';
import { Forbbiden } from '@src/errors/Forbidden';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

export class RefreshTokenModel {
  public async execute(
    reqRefreshToken: string,
    ipAddress: string | null
  ): Promise<{ token: string; refreshToken: string }> {
    if (!reqRefreshToken) {
      throw new BadRequest('Refresh token missing');
    }

    const prismaClient = new PrismaClient();

    const refreshToken = await prismaClient.refreshToken.findFirst({
      where: {
        id: reqRefreshToken
      }
    });

    if (!refreshToken) {
      throw new BadRequest('Invalid refresh token');
    }

    await this.deleteRefreshToken(reqRefreshToken);

    const expires: boolean = dayjs().isAfter(
      dayjs.unix(refreshToken.expires_in)
    );

    if (expires) {
      throw new BadRequest('Expired refresh token');
    }

    if (ipAddress !== refreshToken.ip_address) {
      throw new Forbbiden('Source of request is unknown');
    }

    const token = jwt.sign(
      { id: refreshToken.user_id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '20s'
      }
    );

    const { id } = await this.generateRefreshToken(
      refreshToken.user_id,
      ipAddress
    );

    return {
      token,
      refreshToken: id
    };
  }

  public async generateRefreshToken(
    userId: string,
    ipAddress: string
  ): Promise<RefreshToken> {
    const prismaClient = new PrismaClient();

    const refreshToken = await prismaClient.refreshToken.create({
      data: {
        user_id: userId,
        expires_in: dayjs().add(1, 'minutes').unix(),
        ip_address: ipAddress
      }
    });

    return refreshToken;
  }

  public async deleteRefreshToken(reqRefreshToken: string): Promise<void> {
    const prismaClient = new PrismaClient();

    await prismaClient.refreshToken.delete({
      where: {
        id: reqRefreshToken
      }
    });
  }
}
