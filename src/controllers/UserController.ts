import { UserCreateOutput, UserModel, UserOuput } from '@models/UserModel';
import {
  Controller,
  Middleware,
  ClassErrorMiddleware,
  Delete,
  Get,
  Post,
  Patch
} from '@overnightjs/core';
import { errorHandler } from '@src/middlewares/errorMiddleware';
import { authorizationHandler } from '@src/middlewares/authorizationMiddleware';
import { rateLimitHandler } from '@src/middlewares/rateLimitMiddleware';
import { Request, Response } from 'express';
import requestIp from 'request-ip';
import { CreateUserDto } from '@src/dtos/user/CreateUserDto';
import { GetUserDto } from '@src/dtos/user/GetUserDto';

@Controller('user')
@ClassErrorMiddleware(errorHandler)
export class UserController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const userData: CreateUserDto = req.body;

    const user: UserCreateOutput = await userModel.create(userData);

    res.status(201).json(user);
  }

  @Post('password-reset')
  public async sendPasswordResetEmail(
    req: Request,
    res: Response
  ): Promise<void> {
    const userModel: UserModel = new UserModel();
    const email: string = req.body.email as string;

    const response: UserOuput = await userModel.sendPasswordResetEmail(email);

    res.status(200).json(response);
  }

  @Patch('password-reset')
  public async updateUserPassword(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const token: string = req.query.token as string;
    const newPassword: string = req.body.newPassword as string;

    const response: UserOuput = await userModel.updateUserPassword(
      token,
      newPassword
    );

    res.status(200).json(response);
  }

  @Get('confirm')
  public async emailConfirmation(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const token: string = req.query.token as string;

    const response: UserOuput = await userModel.emailConfirmation(token);

    res.status(200).json(response);
  }

  @Post('resend')
  public async resendEmailConfirmation(
    req: Request,
    res: Response
  ): Promise<void> {
    const userModel: UserModel = new UserModel();
    const email: string = req.body.email as string;

    const response: UserOuput = await userModel.resendEmailConfirmation(email);

    res.status(200).json(response);
  }

  @Get(':id')
  @Middleware(authorizationHandler)
  public async get(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const userId: string = req.params.id;

    const user: GetUserDto = await userModel.get(userId);

    res.status(200).json(user);
  }

  @Delete(':id')
  @Middleware(authorizationHandler)
  public async delete(req: Request, res: Response): Promise<void> {
    const userModel: UserModel = new UserModel();
    const userId: string = req.params.id;

    const user: UserOuput = await userModel.delete(userId);

    res.status(200).json(user);
  }

  @Post('login')
  @Middleware(rateLimitHandler)
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
