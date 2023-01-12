import { RefreshToken } from '@prisma/client';
import { BadRequest } from '@src/errors/BadRequest';
import { Forbbiden } from '@src/errors/Forbidden';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { prismaClient } from '@src/utils/PrismaClientInstance';

export type RefreshTokenOutput = {
  token: string;
  refreshToken: string;
};

export class RefreshTokenModel {
  public async execute(
    reqRefreshToken: string,
    ipAddress: string | null
  ): Promise<RefreshTokenOutput> {
    if (!reqRefreshToken) {
      throw new BadRequest('Refresh token missing');
    }

    const refreshToken = await prismaClient.refreshToken.findFirst({
      where: {
        id: reqRefreshToken
      }
    });

    if (!refreshToken) {
      throw new BadRequest('Invalid refresh token');
    }

    const expired: boolean = dayjs().isAfter(
      dayjs.unix(refreshToken.expires_in)
    );

    if (expired) {
      throw new BadRequest('Expired refresh token');
    }

    if (ipAddress !== refreshToken.ip_address) {
      await this.deleteRefreshToken('', reqRefreshToken);
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
    await this.deleteRefreshToken(userId);

    const refreshToken = await prismaClient.refreshToken.create({
      data: {
        user_id: userId,
        expires_in: dayjs().add(1, 'minutes').unix(),
        ip_address: ipAddress
      }
    });

    return refreshToken;
  }

  public async deleteRefreshToken(
    userId: string,
    reqRefreshToken?: string
  ): Promise<void> {
    await prismaClient.refreshToken.deleteMany({
      where: {
        user_id: userId ? userId : undefined,
        id: reqRefreshToken ? userId : undefined
      }
    });
  }
}
