import { ImvuAccountModel } from '@models/ImvuAccountModel';
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
  @Post('create')
  public async create(req: Request, res: Response): Promise<void> {
    const accountModel: ImvuAccountModel = new ImvuAccountModel();
    const accountData: UserImvuAccount = req.body;

    const account: UserImvuAccount = await accountModel.create(accountData);

    res.status(201).json(account);
  }

  @Patch('q')
  public async update(req: Request, res: Response): Promise<void> {
    const accountModel: ImvuAccountModel = new ImvuAccountModel();
    const userId: number = Number(req.query.user_id);
    const accountId: number = Number(req.query.account_id);
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
    const userId: number = Number(req.query.user_id);
    const accountId: number = Number(req.query.account_id);

    const account: UserImvuAccount[] = await accountModel.get(
      userId,
      accountId
    );

    res.status(200).json(account);
  }

  @Delete('q')
  public async delete(req: Request, res: Response): Promise<void> {
    const accountModel: ImvuAccountModel = new ImvuAccountModel();
    const userId: number = Number(req.query.user_id);
    const accountId: number = Number(req.query.account_id);

    const account: UserImvuAccount = await accountModel.delete(
      userId,
      accountId
    );

    res.status(200).json(account);
  }
}
