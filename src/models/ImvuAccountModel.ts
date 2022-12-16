import { PrismaClient, UserImvuAccount } from '@prisma/client';
import { BadRequest } from '@src/errors/BadRequest';
import { NotFound } from '@src/errors/NotFound';
import CryptoJS from 'crypto-js';

export class ImvuAccountModel {
  public async create(
    imvuAccountData: UserImvuAccount
  ): Promise<UserImvuAccount> {
    const exists: boolean = await this.imvuAccountExists(
      imvuAccountData.user_id,
      '',
      imvuAccountData.username
    );

    if (exists) {
      throw new BadRequest('Imvu account already exists');
    }

    const prismaClient = new PrismaClient();

    const cipherPass = CryptoJS.AES.encrypt(
      imvuAccountData.password,
      process.env.CRYPTO_KEY as string
    ).toString();

    const imvuAccount = await prismaClient.userImvuAccount.create({
      data: {
        user_id: imvuAccountData.user_id,
        username: imvuAccountData.username,
        password: cipherPass
      }
    });

    return imvuAccount;
  }

  public async update(
    imvuAccountData: UserImvuAccount,
    userId: string,
    accountId: string
  ): Promise<UserImvuAccount> {
    if (!userId || !accountId) {
      throw new BadRequest('User or account id is missing');
    }

    const exists: boolean = await this.imvuAccountExists(userId, accountId, '');

    if (!exists) {
      throw new BadRequest('Imvu account does not exists');
    }

    const prismaClient = new PrismaClient();

    let cipherPass: string | undefined = undefined;

    if (imvuAccountData.password) {
      cipherPass = CryptoJS.AES.encrypt(
        imvuAccountData.password,
        process.env.CRYPTO_KEY as string
      ).toString();
    }

    const imvuAccount = await prismaClient.userImvuAccount.update({
      where: {
        id: accountId
      },
      data: {
        username: imvuAccountData.username,
        password: cipherPass
      }
    });

    return imvuAccount;
  }

  public async get(
    userId: string,
    accountId: string
  ): Promise<UserImvuAccount[]> {
    const prismaClient = new PrismaClient();

    const imvuAccounts = await prismaClient.userImvuAccount.findMany({
      where: { user_id: userId || undefined, id: accountId || undefined },
      orderBy: { username: 'asc' }
    });

    if (!imvuAccounts.length) {
      throw new NotFound('Imvu accounts not found');
    }

    return imvuAccounts;
  }

  public async delete(
    userId: string,
    accountId: string
  ): Promise<UserImvuAccount> {
    if (!userId || !accountId) {
      throw new BadRequest('User or account id is missing');
    }

    const exists: boolean = await this.imvuAccountExists(userId, accountId, '');

    if (!exists) {
      throw new BadRequest('Imvu account does not exist');
    }

    const prismaClient = new PrismaClient();

    const imvuAccount = await prismaClient.userImvuAccount.delete({
      where: { id: accountId }
    });

    return imvuAccount;
  }

  public async imvuAccountExists(
    userId: string,
    accountId: string,
    username: string
  ): Promise<boolean> {
    const prismaClient = new PrismaClient();

    const user = await prismaClient.userImvuAccount.findFirst({
      where: {
        user_id: userId,
        id: accountId ? accountId : '',
        username: username ? username : ''
      }
    });

    if (!user) {
      return false;
    }

    return true;
  }
}
