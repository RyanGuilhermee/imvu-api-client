import { json } from 'express';
import { Server } from '@overnightjs/core';
import { HomeController } from '@controllers/HomeController';
import { UserController } from '@controllers/UserController';
import 'express-async-errors';
import dotenv from 'dotenv';

dotenv.config();

export class SetupServer extends Server {
  /**
   *
   */
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(json());
  }

  private setupControllers(): void {
    const homeController = new HomeController();
    const userController = new UserController();
    this.addControllers([homeController, userController]);
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
