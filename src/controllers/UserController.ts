import { UserModel } from '@models/UserModel';
import {
  Controller,
  Middleware,
  ErrorMiddleware,
  ClassErrorMiddleware,
  Delete,
  Get,
  Post
} from '@overnightjs/core';
import { User } from '@prisma/client';
import { errorHandler } from '@src/middlewares/ErrorMiddleware';
import { Request, Response } from 'express';

@Controller('user')
@ClassErrorMiddleware(errorHandler)
export class UserController {
  @Post('create')
  public async create(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const dataUser: User = req.body;

    const user = await userModel.create(dataUser);

    res.status(200).json(user);
  }

  @Get(':id')
  public async get(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const userId: number = Number(req.params.id);

    const user = await userModel.get(userId);

    res.status(200).json(user);
  }

  @Delete(':id')
  public async delete(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const userId: number = Number(req.params.id);

    const user = await userModel.delete(userId);

    res.status(200).json(user);
  }
}
