export class ConfirmationEmailResentEvent {
  constructor(
    public readonly email: string,
    public readonly confirmationCode: string,
  ) {}
}
