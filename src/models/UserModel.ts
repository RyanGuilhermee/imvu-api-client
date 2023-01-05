import {
  EmailVerificationToken,
  PasswordResetToken,
  User
} from '@prisma/client';
import { BadRequest } from '@src/errors/BadRequest';
import { NotFound } from '@src/errors/NotFound';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from './RefreshTokenModel';
import { prismaClient } from '@src/utils/PrismaClientInstance';
import { EmailVerificationTokenModel } from './EmailVerificationTokenModel';
import dayjs from 'dayjs';
import { EmailVerification } from '@src/providers/EmailVerification';
import { PasswordResetEmail } from '@src/providers/PasswordResetEmail';
import { PasswordResetTokenModel } from './PasswordResetTokenModel';
import PasswordValidator from 'password-validator';

export class UserModel {
  public async create(userData: User): Promise<{}> {
    const exists: boolean = await this.userExists('', userData.email);

    if (exists) {
      throw new BadRequest('User already exists');
    }

    const schema: PasswordValidator = new PasswordValidator();
    schema
      .is()
      .min(8)
      .is()
      .max(200)
      .has()
      .letters()
      .has()
      .uppercase()
      .lowercase()
      .has()
      .not()
      .spaces()
      .has()
      .symbols();

    if (!schema.validate(userData.password)) {
      const details = schema.validate(userData.password, {
        details: true
      }) as any[];

      throw new BadRequest(details[0].message);
    }

    const hashPassword: string = await bcrypt.hash(userData.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashPassword,
        verified: false
      }
    });

    await EmailVerification.sendEmail(user);

    return {
      name: user.name,
      email: user.email,
      message: 'User created successfully! Please, confirm your email address'
    };
  }

  public async update(userId: string, userData: User): Promise<User> {
    if (!userId) {
      throw new BadRequest('User id missing');
    }

    const user = await prismaClient.user.update({
      where: {
        id: userId
      },
      data: {
        email: userData.email ? userData.email : undefined,
        password: userData.password ? userData.password : undefined,
        verified: userData.verified ? userData.verified : undefined
      }
    });

    return user;
  }

  public async get(userId: string): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFound('User not found');
    }

    return user;
  }

  private async getByEmail(email: string): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: { email: email }
    });

    if (!user) {
      throw new NotFound('User not found');
    }

    return user;
  }

  public async delete(userId: string) {
    const exists: boolean = await this.userExists(userId, '');

    if (!exists) {
      throw new BadRequest('User does not exist');
    }

    await prismaClient.user.delete({
      where: { id: userId }
    });

    return {
      status: 200,
      message: 'Successfully deleted'
    };
  }

  public async userExists(userId: string, email: string): Promise<boolean> {
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

    const user = await prismaClient.user.findFirst({
      where: { email: email }
    });

    if (!user) {
      throw new BadRequest('Incorrect email or password');
    }

    if (!user.verified) {
      throw new BadRequest(
        'Unverified user. Please, complete your registration by confirming your email address'
      );
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

  public async emailConfirmation(hashToken: string) {
    if (!hashToken) {
      throw new BadRequest('Missing confirmation token');
    }

    const token: EmailVerificationToken = await EmailVerificationTokenModel.get(
      hashToken
    );

    const user: User = await this.get(token.user_id);

    const expired: boolean = dayjs().isAfter(dayjs.unix(token.expires_in));

    if (expired) {
      await EmailVerificationTokenModel.delete(user.id);
      throw new BadRequest('Expired confirmation token');
    }

    await this.update(user.id, {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      verified: true,
      created_at: user.created_at
    });

    await EmailVerificationTokenModel.delete(user.id);

    return {
      status: 200,
      message: 'Your account has been successfully verified'
    };
  }

  public async resendEmailConfirmation(email: string) {
    if (!email) {
      throw new BadRequest('Missing email');
    }

    const user: User = await this.getByEmail(email);

    await EmailVerification.sendEmail(user);

    return {
      status: 200,
      message: 'Link resent successfully'
    };
  }

  public async sendPasswordResetEmail(email: string) {
    if (!email) {
      throw new BadRequest('Missing email');
    }

    const user: User = await this.getByEmail(email);

    if (!user.verified) {
      throw new BadRequest(
        'Unverified user. Please, complete your registration by confirming your email address'
      );
    }

    await PasswordResetEmail.sendEmail(user);

    return {
      status: 200,
      message: 'Password reset link successfully sent'
    };
  }

  public async updateUserPassword(hashToken: string, newPassword: string) {
    if (!hashToken) {
      throw new BadRequest('Missing reset token');
    }

    const token: PasswordResetToken = await PasswordResetTokenModel.get(
      hashToken
    );

    const user: User = await this.get(token.user_id);

    const expired: boolean = dayjs().isAfter(dayjs.unix(token.expires_in));

    if (expired) {
      await PasswordResetTokenModel.delete(user.id);
      throw new BadRequest('Expired reset token');
    }

    const schema: PasswordValidator = new PasswordValidator();
    schema
      .is()
      .min(8)
      .is()
      .max(200)
      .has()
      .letters()
      .has()
      .uppercase()
      .lowercase()
      .has()
      .not()
      .spaces()
      .has()
      .symbols();

    if (!schema.validate(newPassword)) {
      const details = schema.validate(newPassword, { details: true }) as any[];

      throw new BadRequest(details[0].message);
    }

    const hashNewPassword: string = await bcrypt.hash(newPassword, 10);

    await this.update(user.id, {
      id: user.id,
      name: user.name,
      email: user.email,
      password: hashNewPassword,
      verified: user.verified,
      created_at: user.created_at
    });

    await PasswordResetTokenModel.delete(user.id);

    return {
      status: 200,
      message: 'Password changed successfully'
    };
  }
}
