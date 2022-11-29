import { PrismaClient, User } from '@prisma/client';
import { BadRequest } from '@src/errors/BadRequest';
import { InternalServerError } from '@src/errors/InternalServerError';
import { NotFound } from '@src/errors/NotFound';

export class UserModel {
  public async create(userData: User): Promise<User> {
    const exists: boolean = await this.userExists(userData.email);

    if (exists) {
      throw new BadRequest('User already exists.');
    }

    const prismaClient = new PrismaClient();

    const user = await prismaClient.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password
      }
    });

    return user;
  }

  public async get(userId: number): Promise<User> {
    const prismaClient = new PrismaClient();

    const user = await prismaClient.user.findFirst({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFound('User not found.');
    }

    return user;
  }

  public async delete(userId: number): Promise<User> {
    const exists: boolean = await this.userExists(userId);

    if (!exists) {
      throw new BadRequest('User does not exist.');
    }

    const prismaClient = new PrismaClient();

    const user = await prismaClient.user.delete({
      where: { id: userId }
    });

    return user;
  }

  public async userExists(userId: number): Promise<boolean>;
  public async userExists(email: string): Promise<boolean>;
  public async userExists(args: number | string): Promise<boolean> {
    const prismaClient = new PrismaClient();

    const user = await prismaClient.user.findFirst({
      where: {
        id: typeof args === 'number' ? args : undefined,
        email: typeof args === 'string' ? args : undefined
      }
    });

    if (!user) {
      return false;
    }

    return true;
  }
}
