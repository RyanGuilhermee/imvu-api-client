import { UserImvuAccount } from '@prisma/client';
import { BadRequest } from '@src/errors/BadRequest';
import { NotFound } from '@src/errors/NotFound';
import CryptoJS from 'crypto-js';
import { prismaClient } from '@src/utils/PrismaClientInstance';
import { Client } from '@imvuClient/client';
import { User, WalletResponse } from '@src/providers/imvuClient/src';

export type ImvuAccountInfos = {
  username: string;
  displayName: string;
  gender: string | undefined;
  age: number | undefined;
  country: string;
  profilePicture: string | undefined;
  avatarImage: string;
  avatarPortraitImage: string;
  isVip: boolean;
  isAp: boolean;
  created: Date;
  credits: number;
  promo_credits: number;
  followingCount: number | undefined;
  followerCount: number | undefined;
};

export class ImvuAccountModel {
  public async create(
    imvuAccountData: UserImvuAccount
  ): Promise<{ userId: string; id: string; infos: ImvuAccountInfos }> {
    const exists: boolean = await this.imvuAccountExists(
      imvuAccountData.user_id,
      '',
      imvuAccountData.username
    );

    if (exists) {
      throw new BadRequest('Imvu account already exists');
    }

    const infos: ImvuAccountInfos = await this.getImvuInfos(
      imvuAccountData.username,
      imvuAccountData.password
    );

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

    return {
      userId: imvuAccount.user_id,
      id: imvuAccount.id,
      infos
    };
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
    accountId?: string | undefined
  ): Promise<UserImvuAccount[]> {
    if (!userId) {
      throw new BadRequest('User id missing');
    }

    const imvuAccounts = await prismaClient.userImvuAccount.findMany({
      where: { user_id: userId, id: accountId || undefined },
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
    const user = await prismaClient.userImvuAccount.findFirst({
      where: {
        user_id: userId,
        id: accountId ? accountId : undefined,
        username: username ? username : undefined
      }
    });

    if (!user) {
      return false;
    }

    return true;
  }

  private async getImvuInfos(
    username: string,
    password: string
  ): Promise<ImvuAccountInfos> {
    try {
      const client = new Client();

      await client.login(username, password);

      const user: User = client.account.user;
      const wallet: WalletResponse = await client.account.wallet.status();
      const profile = await user.profile();

      const imvuAccountInfos: ImvuAccountInfos = {
        username: user.username,
        displayName: user.displayName,
        gender: user.gender,
        age: user.age,
        country: user.country,
        profilePicture: profile?.image,
        avatarImage: user.avatarImage,
        avatarPortraitImage: user.avatarPortraitImage,
        isVip: user.isVip,
        isAp: user.isAp,
        created: user.created,
        credits: wallet.credits,
        promo_credits: wallet.promo_credits,
        followingCount: profile?.followingCount,
        followerCount: profile?.followerCount
      };

      return imvuAccountInfos;
    } catch (error) {
      console.log(error);
      throw new BadRequest('Invalid email or password');
    }
  }

  public async getImvuInfosByUserId(userId: string): Promise<{
    userId: string;
    imvuAccountsInfos: { id: string; infos: ImvuAccountInfos }[];
  }> {
    const imvuAccounts: UserImvuAccount[] = await this.get(userId);
    const imvuAccountsInfos: { id: string; infos: ImvuAccountInfos }[] = [];

    for await (const imvuAccount of imvuAccounts) {
      const decryptedPass = CryptoJS.AES.decrypt(
        imvuAccount.password,
        process.env.CRYPTO_KEY as string
      ).toString(CryptoJS.enc.Utf8);

      const imvuAccountInfos: ImvuAccountInfos = await this.getImvuInfos(
        imvuAccount.username,
        decryptedPass
      );

      imvuAccountsInfos.push({
        id: imvuAccount.id,
        infos: imvuAccountInfos
      });
    }

    return {
      userId: imvuAccounts[0].user_id,
      imvuAccountsInfos
    };
  }
}
