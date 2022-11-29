import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('/')
export class HomeController {
  @Get()
  public home(_: Request, res: Response): void {
    res.status(200).json({
      message: 'Hello World'
    });
  }
}
