import { PrismaClient, Reward } from '@prisma/client';
import { BadRequest } from '@src/errors/BadRequest';
import { NotFound } from '@src/errors/NotFound';

export class RewardModel {
  public async create(rewardData: Reward): Promise<Reward> {
    const prismaClient = new PrismaClient();
    const isNumber: number = Number(rewardData.name);
    console.log(rewardData);
    const reward = await prismaClient.reward.create({
      data: {
        imvu_account_id: rewardData.imvu_account_id,
        name: isNumber ? `${rewardData.name} Credits` : rewardData.name,
        image: rewardData.image
      }
    });

    return reward;
  }

  public async get(accountId: number): Promise<Reward[]> {
    const prismaClient = new PrismaClient();

    const reward = await prismaClient.reward.findMany({
      where: {
        imvu_account_id: accountId
      }
    });

    if (!reward.length) {
      throw new NotFound('Rewards not found');
    }

    return reward;
  }
}
