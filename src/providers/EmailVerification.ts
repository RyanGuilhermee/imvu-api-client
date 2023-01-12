import { GetUserDto } from '@src/dtos/user/GetUserDto';
import { EmailVerificationTokenModel } from '@src/models/EmailVerificationTokenModel';
import { Email } from './Email';

export class EmailVerification {
  public static async sendEmail(user: GetUserDto): Promise<void> {
    const token: string = await EmailVerificationTokenModel.create(
      user.email,
      user.id
    );

    Email.sendEmail({
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Verificação de email',
      html: `
            <h2>Olá, ${user.name}!</h2>
            <p>Obrigado por se cadastrar. Por favor, confirme seu email clicando
              <a href="${process.env.DOMAIN}/user/confirm?token=${token}" style="color: blue;">aqui</a>
            </p>
        `
    });
  }
}
