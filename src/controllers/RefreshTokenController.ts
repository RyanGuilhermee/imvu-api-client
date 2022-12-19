import { RefreshTokenModel } from '@models/RefreshTokenModel';
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
    const reqRefreshToken: string = req.body.refreshToken;
    const ipAddress: string | null = requestIp.getClientIp(req);

    const { token, refreshToken } = await refreshTokenModel.execute(
      reqRefreshToken,
      ipAddress
    );

    res.status(201).json({
      token,
      refreshToken
    });
  }
}
