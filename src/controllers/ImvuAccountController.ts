import { ImvuAccountInfos, ImvuAccountModel } from '@models/ImvuAccountModel';
import {
  Controller,
  ClassMiddleware,
  ClassErrorMiddleware,
  Delete,
  Get,
  Post,
  Patch
} from '@overnightjs/core';
import { UserImvuAccount } from '@prisma/client';
import { errorHandler } from '@src/middlewares/errorMiddleware';
import { authorizationHandler } from '@src/middlewares/authorizationMiddleware';
import { Request, Response } from 'express';

@Controller('user/accounts')
@ClassMiddleware(authorizationHandler)
@ClassErrorMiddleware(errorHandler)
export class ImvuAccountController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    const accountModel: ImvuAccountModel = new ImvuAccountModel();
    const accountData: UserImvuAccount = req.body;

    const account: { userId: string; id: string; infos: ImvuAccountInfos } =
      await accountModel.create(accountData);

    res.status(201).json(account);
  }

  @Patch('q')
  public async update(req: Request, res: Response): Promise<void> {
    const accountModel: ImvuAccountModel = new ImvuAccountModel();
    const userId: string = req.query.user_id as string;
    const accountId: string = req.query.account_id as string;
    const accountData: UserImvuAccount = req.body;

    const account: UserImvuAccount = await accountModel.update(
      accountData,
      userId,
      accountId
    );

    res.status(201).json(account);
  }

  @Get('q')
  public async get(req: Request, res: Response): Promise<void> {
    const accountModel: ImvuAccountModel = new ImvuAccountModel();
    const userId: string = req.query.user_id as string;
    const accountId: string = req.query.account_id as string;

    const account: UserImvuAccount[] = await accountModel.get(
      userId,
      accountId
    );

    res.status(200).json(account);
  }

  @Get('infos')
  public async getImvuInfos(req: Request, res: Response): Promise<void> {
    const accountModel: ImvuAccountModel = new ImvuAccountModel();
    const userId: string = req.query.user_id as string;

    const accountInfos: {
      userId: string;
      imvuAccountsInfos: { id: string; infos: ImvuAccountInfos }[];
    } = await accountModel.getImvuInfosByUserId(userId);

    res.status(200).json(accountInfos);
  }

  @Delete('q')
  public async delete(req: Request, res: Response): Promise<void> {
    const accountModel: ImvuAccountModel = new ImvuAccountModel();
    const userId: string = req.query.user_id as string;
    const accountId: string = req.query.account_id as string;

    const account: UserImvuAccount = await accountModel.delete(
      userId,
      accountId
    );

    res.status(200).json(account);
  }
}
