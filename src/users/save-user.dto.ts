export class SaveUserDto {
  id: string | undefined;
  mailAddress: string | null = null;
  password: string | null = null;
  nickname!: string;
  description: string | null = null;
}
