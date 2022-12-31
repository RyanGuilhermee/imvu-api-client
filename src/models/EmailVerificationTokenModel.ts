import { EmailVerificationToken } from '@prisma/client';
import { NotFound } from '@src/errors/NotFound';
import { prismaClient } from '@src/utils/PrismaClientInstance';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

export class EmailVerificationTokenModel {
  public static async create(email: string, userId: string): Promise<string> {
    const hashToken: string = await bcrypt.hash(email, 10);

    await prismaClient.emailVerificationToken.create({
      data: {
        token: hashToken,
        expires_in: dayjs().add(10, 'minutes').unix(),
        user_id: userId
      }
    });

    return hashToken;
  }

  public static async get(token: string): Promise<EmailVerificationToken> {
    const tokenInfos: EmailVerificationToken | null =
      await prismaClient.emailVerificationToken.findFirst({
        where: {
          token
        }
      });

    if (!tokenInfos) {
      throw new NotFound('Invalid verification token');
    }

    return tokenInfos;
  }

  public static async delete(userId: string) {
    await prismaClient.emailVerificationToken.delete({
      where: {
        user_id: userId
      }
    });
  }
}
