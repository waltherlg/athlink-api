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
    confirmUrl: string,
  ): EmailTemplateResult {
    const subject = 'Подтверждение регистрации';
    const text = [
      'Спасибо за регистрацию!',
      `Ваш код подтверждения: ${confirmationCode}`,
      `Ссылка для подтверждения: ${confirmUrl}`,
      'Если вы не регистрировались, просто проигнорируйте это письмо.',
    ].join('\n');

    const html = [
      '<h2>Спасибо за регистрацию!</h2>',
      `<p>Ваш код подтверждения: <b>${confirmationCode}</b></p>`,
      `<p>Ссылка для подтверждения: <a href="${confirmUrl}">${confirmUrl}</a></p>`,
      '<p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>',
    ].join('');

    return { subject, text, html };
  }

  buildConfirmationResend(
    confirmationCode: string,
    confirmUrl: string,
  ): EmailTemplateResult {
    const subject = 'Повторное подтверждение почты';
    const text = [
      'Вы запросили повторное подтверждение почты.',
      `Ваш код подтверждения: ${confirmationCode}`,
      `Ссылка для подтверждения: ${confirmUrl}`,
      'Если это были не вы, просто проигнорируйте это письмо.',
    ].join('\n');

    const html = [
      '<h2>Повторное подтверждение почты</h2>',
      `<p>Ваш код подтверждения: <b>${confirmationCode}</b></p>`,
      `<p>Ссылка для подтверждения: <a href="${confirmUrl}">${confirmUrl}</a></p>`,
      '<p>Если это были не вы, просто проигнорируйте это письмо.</p>',
    ].join('');

    return { subject, text, html };
  }

  buildPasswordReset(resetCode: string, resetUrl: string): EmailTemplateResult {
    const subject = 'Смена пароля';
    const text = [
      'Вы запросили сброс пароля.',
      `Код для смены пароля: ${resetCode}`,
      `Ссылка для смены пароля: ${resetUrl}`,
      'Если это были не вы, просто проигнорируйте это письмо.',
    ].join('\n');

    const html = [
      '<h2>Смена пароля</h2>',
      `<p>Код для смены пароля: <b>${resetCode}</b></p>`,
      `<p>Ссылка для смены пароля: <a href="${resetUrl}">${resetUrl}</a></p>`,
      '<p>Если это были не вы, просто проигнорируйте это письмо.</p>',
    ].join('');

    return { subject, text, html };
  }
}
