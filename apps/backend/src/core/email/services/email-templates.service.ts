import { Injectable } from '@nestjs/common';

export type EmailTemplateResult = {
  subject: string;
  text: string;
  html: string;
};

@Injectable()
export class EmailTemplatesService {
  buildRegistrationConfirmation(
    confirmationCode: string,
  ): EmailTemplateResult {
    const subject = 'Подтверждение регистрации';
    const text = [
      'Спасибо за регистрацию!',
      `Ваш код подтверждения: ${confirmationCode}`,
      'Если вы не регистрировались, просто проигнорируйте это письмо.',
    ].join('\n');

    const html = [
      '<h2>Спасибо за регистрацию!</h2>',
      `<p>Ваш код подтверждения: <b>${confirmationCode}</b></p>`,
      '<p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>',
    ].join('');

    return { subject, text, html };
  }

  buildConfirmationResend(confirmationCode: string): EmailTemplateResult {
    const subject = 'Повторное подтверждение почты';
    const text = [
      'Вы запросили повторное подтверждение почты.',
      `Ваш код подтверждения: ${confirmationCode}`,
      'Если это были не вы, просто проигнорируйте это письмо.',
    ].join('\n');

    const html = [
      '<h2>Повторное подтверждение почты</h2>',
      `<p>Ваш код подтверждения: <b>${confirmationCode}</b></p>`,
      '<p>Если это были не вы, просто проигнорируйте это письмо.</p>',
    ].join('');

    return { subject, text, html };
  }

  buildPasswordReset(resetCode: string): EmailTemplateResult {
    const subject = 'Сброс пароля';
    const text = [
      'Вы запросили сброс пароля.',
      `Код для сброса пароля: ${resetCode}`,
      'Если это были не вы, просто проигнорируйте это письмо.',
    ].join('\n');

    const html = [
      '<h2>Сброс пароля</h2>',
      `<p>Код для сброса пароля: <b>${resetCode}</b></p>`,
      '<p>Если это были не вы, просто проигнорируйте это письмо.</p>',
    ].join('');

    return { subject, text, html };
  }
}
