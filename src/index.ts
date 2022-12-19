import { json } from 'express';
import { Server } from '@overnightjs/core';
import { HomeController } from '@controllers/HomeController';
import { UserController } from '@controllers/UserController';
import { ImvuAccountController } from './controllers/ImvuAccountController';
import { RewardController } from './controllers/RewardController';
import { RefreshTokenController } from './controllers/RefreshTokenController';
import 'express-async-errors';
import dotenv from 'dotenv';

dotenv.config();

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(json());
  }

  private setupControllers(): void {
    const homeController = new HomeController();
    const userController = new UserController();
    const imvuAccountController = new ImvuAccountController();
    const rewardController = new RewardController();
    const refreshTokenController = new RefreshTokenController();

    this.addControllers([
      homeController,
      userController,
      imvuAccountController,
      rewardController,
      refreshTokenController
    ]);
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  public startServer(): void {
    this.init();
    this.app.listen(this.port, () => console.log('server is running!'));
  }
}
