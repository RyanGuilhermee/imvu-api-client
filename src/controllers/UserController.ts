import { UserModel } from '@models/UserModel';
import {
  Controller,
  Middleware,
  ClassErrorMiddleware,
  Delete,
  Get,
  Post
} from '@overnightjs/core';
import { User } from '@prisma/client';
import { errorHandler } from '@src/middlewares/errorMiddleware';
import { authorizationHandler } from '@src/middlewares/authorizationMiddleware';
import { Request, Response } from 'express';

@Controller('user')
@ClassErrorMiddleware(errorHandler)
export class UserController {
  @Post('create')
  public async create(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const userData: User = req.body;

    const user: User = await userModel.create(userData);

    res.status(201).json(user);
  }

  @Get(':id')
  @Middleware(authorizationHandler)
  public async get(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const userId: string = req.params.id;

    const user: User = await userModel.get(userId);

    res.status(200).json(user);
  }

  @Delete(':id')
  @Middleware(authorizationHandler)
  public async delete(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const userId: string = req.params.id;

    const user = await userModel.delete(userId);

    res.status(200).json(user);
  }

  @Post('login')
  public async authentication(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const { email, password }: { email: string; password: string } = req.body;

    const token: string = await userModel.authentication(email, password);

    res.status(200).json({
      token
    });
  }
}
