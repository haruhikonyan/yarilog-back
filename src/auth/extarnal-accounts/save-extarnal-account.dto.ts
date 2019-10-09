import { ProviderType } from './extarnal-accounts.entity';
import { SaveUserDto } from '../../users/save-user.dto';

export class SaveExtarnalAccountDto {
  id: number | undefined;
  accountId!: string;
  providerType!: ProviderType;
  user!: SaveUserDto;
}
