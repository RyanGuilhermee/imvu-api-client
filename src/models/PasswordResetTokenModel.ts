import { PasswordResetToken } from '@prisma/client';
import { NotFound } from '@src/errors/NotFound';
import { prismaClient } from '@src/utils/PrismaClientInstance';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

export class PasswordResetTokenModel {
  public static async create(email: string, userId: string): Promise<string> {
    const hashToken: string = await bcrypt.hash(email, 10);

    await prismaClient.passwordResetToken.create({
      data: {
        token: hashToken,
        expires_in: dayjs().add(1, 'hour').unix(),
        user_id: userId
      }
    });

    return hashToken;
  }

  public static async get(token: string): Promise<PasswordResetToken> {
    const tokenInfos: PasswordResetToken | null =
      await prismaClient.passwordResetToken.findFirst({
        where: {
          token
        }
      });

    if (!tokenInfos) {
      throw new NotFound('Invalid reset token');
    }

    return tokenInfos;
  }

  public static async delete(userId: string) {
    await prismaClient.passwordResetToken.delete({
      where: {
        user_id: userId
      }
    });
  }
}
