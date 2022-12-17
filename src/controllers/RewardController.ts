import { RewardModel } from '@models/RewardModel';
import {
  Controller,
  ClassMiddleware,
  ClassErrorMiddleware,
  Get,
  Post
} from '@overnightjs/core';
import { Reward } from '@prisma/client';
import { errorHandler } from '@src/middlewares/errorMiddleware';
import { authorizationHandler } from '@src/middlewares/authorizationMiddleware';
import { Request, Response } from 'express';

@Controller('user/accounts/rewards')
@ClassMiddleware(authorizationHandler)
@ClassErrorMiddleware(errorHandler)
export class RewardController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    const rewardModel: RewardModel = new RewardModel();
    const rewardData: Reward = req.body;

    const reward: Reward = await rewardModel.create(rewardData);

    res.status(201).json(reward);
  }

  @Get(':id')
  public async get(req: Request, res: Response): Promise<void> {
    const rewardModel: RewardModel = new RewardModel();
    const accountId: string = req.params.account_id as string;

    const reward: Reward[] = await rewardModel.get(accountId);

    res.status(200).json(reward);
  }
}
