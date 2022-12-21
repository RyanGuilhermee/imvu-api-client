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
import requestIp from 'request-ip';

@Controller('user')
@ClassErrorMiddleware(errorHandler)
export class UserController {
  @Post()
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
    const ipAddress: string | null = requestIp.getClientIp(req);

    const authPayload: { token: string; refreshToken?: string | undefined } =
      await userModel.authentication(email, password, ipAddress);

    res
      .status(200)
      .cookie('auth', authPayload, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true
      })
      .json({
        status: 200,
        message: 'Successfully authenticated user!'
      });
  }
}
