export class PasswordResetRequestedEvent {
  constructor(
    public readonly email: string,
    public readonly resetCode: string,
  ) {}
}
