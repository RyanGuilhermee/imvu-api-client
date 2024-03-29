import {
  RefreshTokenModel,
  RefreshTokenOutput
} from '@models/RefreshTokenModel';
import { Controller, ClassErrorMiddleware, Post } from '@overnightjs/core';
import { errorHandler } from '@src/middlewares/errorMiddleware';
import { Request, Response } from 'express';
import requestIp from 'request-ip';

@Controller('refresh-token')
@ClassErrorMiddleware(errorHandler)
export class RefreshTokenController {
  @Post()
  public async execute(req: Request, res: Response): Promise<void> {
    const refreshTokenModel: RefreshTokenModel = new RefreshTokenModel();
    const reqRefreshToken: string = req.cookies.auth.refreshToken;
    const ipAddress: string | null = requestIp.getClientIp(req);

    const refreshAuthPayload: RefreshTokenOutput =
      await refreshTokenModel.execute(reqRefreshToken, ipAddress);

    res
      .status(201)
      .cookie('auth', refreshAuthPayload, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true
      })
      .json({
        status: 201,
        message: 'Successfully token generated!'
      });
  }
}
