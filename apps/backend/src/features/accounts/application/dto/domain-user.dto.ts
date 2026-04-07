export class UserCreateDto {
  email: string;
  userName: string;
  passwordHash: string;
  confirmationCode: string;
  confirmCodeExpiryDate: Date;
  isConfirmed: boolean;
}
