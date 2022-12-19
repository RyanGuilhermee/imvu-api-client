import { PrismaClient, User } from '@prisma/client';
import { BadRequest } from '@src/errors/BadRequest';
import { NotFound } from '@src/errors/NotFound';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from './RefreshTokenModel';

export class UserModel {
  public async create(userData: User): Promise<User> {
    const exists: boolean = await this.userExists('', userData.email);

    if (exists) {
      throw new BadRequest('User already exists');
    }

    const prismaClient = new PrismaClient();

    const hashPassword: string = await bcrypt.hash(userData.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashPassword
      }
    });

    return user;
  }

  public async get(userId: string): Promise<User> {
    const prismaClient = new PrismaClient();

    const user = await prismaClient.user.findFirst({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFound('User not found');
    }

    return user;
  }

  public async delete(userId: string): Promise<User> {
    const exists: boolean = await this.userExists(userId, '');

    if (!exists) {
      throw new BadRequest('User does not exist');
    }

    const prismaClient = new PrismaClient();

    const user = await prismaClient.user.delete({
      where: { id: userId }
    });

    return user;
  }

  public async userExists(userId: string, email: string): Promise<boolean> {
    const prismaClient = new PrismaClient();

    const user = await prismaClient.user.findFirst({
      where: {
        id: userId ? userId : undefined,
        email: email ? email : undefined
      }
    });

    if (!user) {
      return false;
    }

    return true;
  }

  public async authentication(
    email: string,
    password: string,
    ipAddress: string | null
  ): Promise<{ token: string; refreshToken?: string }> {
    if (!email || !password) {
      throw new BadRequest('Email or password is missing');
    }

    const prismaClient = new PrismaClient();

    const user = await prismaClient.user.findFirst({
      where: { email: email }
    });

    if (!user) {
      throw new BadRequest('Incorrect email or password');
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new BadRequest('Incorrect email or password');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    });

    if (!ipAddress) {
      return {
        token
      };
    }

    const refreshTokenModel = new RefreshTokenModel();
    const { id } = await refreshTokenModel.generateRefreshToken(
      user.id,
      ipAddress
    );

    return {
      token,
      refreshToken: id
    };
  }
}
