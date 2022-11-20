import * as express from 'express';
import { Server } from '@overnightjs/core';
// import { HomeController } from '@controllers/HomeController';
// import { UserController } from '@controllers/UserController';

class SetupServer extends Server {
  /**
   *
   */
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private startServer(): void {
    this.app.listen(this.port, () => console.log('server is running!'));
  }

  private setupControllers(): void {
    // const homeController = new HomeController();
    // const userController = new UserController();
    // this.addControllers([homeController, userController]);
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
    this.startServer();
  }
}

const setupServer = new SetupServer();
setupServer.init();
