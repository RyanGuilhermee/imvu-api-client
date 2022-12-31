import { Reward } from '@prisma/client';
import { NotFound } from '@src/errors/NotFound';
import { prismaClient } from '@src/utils/PrismaClientInstance';

export class RewardModel {
  public async create(rewardData: Reward): Promise<Reward> {
    const isNumber: number = Number(rewardData.name);

    const reward = await prismaClient.reward.create({
      data: {
        imvu_account_id: rewardData.imvu_account_id,
        name: isNumber ? `${rewardData.name} Credits` : rewardData.name,
        image: rewardData.image
      }
    });

    return reward;
  }

  public async get(accountId: string): Promise<Reward[]> {
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
