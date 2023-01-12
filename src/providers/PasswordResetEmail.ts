import { GetUserDto } from '@src/dtos/user/GetUserDto';
import { PasswordResetTokenModel } from '@src/models/PasswordResetTokenModel';
import { Email } from './Email';

export class PasswordResetEmail {
  public static async sendEmail(user: GetUserDto): Promise<void> {
    const token: string = await PasswordResetTokenModel.create(
      user.email,
      user.id
    );

    Email.sendEmail({
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Redefinição de senha',
      html: `
            <h2>Olá, ${user.name}!</h2> 
            <p>Clique 
              <a href="${process.env.DOMAIN}/user/password-reset?token=${token}" style="color: blue;">aqui </a>
              para redefinir sua senha.
            </p>
        `
    });
  }
}
