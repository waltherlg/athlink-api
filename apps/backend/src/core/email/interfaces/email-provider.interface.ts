export type EmailSendOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export interface EmailProvider {
  sendEmail(options: EmailSendOptions): Promise<void>;
}
