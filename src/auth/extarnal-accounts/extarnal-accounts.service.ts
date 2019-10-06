import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalAccount, ProviderType } from './extarnal-accounts.entity';
import { AuthLoginObject } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { SaveExtarnalAccountDto } from './save-extarnal-account.dto';
import { SaveUserDto } from 'src/users/save-user.dto';

@Injectable()
export class ExtarnalAccountsService {
  constructor(
    @InjectRepository(ExternalAccount)
    private readonly externalAccountsRepository: Repository<ExternalAccount>,
    private readonly usersService: UsersService,
  ) {}

  async findByAuthLoginObject(
    authLoginObject: AuthLoginObject,
  ): Promise<ExternalAccount | undefined> {
    return this.externalAccountsRepository.findOne({
      where: {
        accountId: authLoginObject.id,
        providerType: authLoginObject.providerType,
      },
      relations: ['user'],
    });
  }

  async createFromOauthLogin(authLoginObject: AuthLoginObject) {
    const newExternalAccount = new SaveExtarnalAccountDto();
    newExternalAccount.accountId = authLoginObject.id;
    newExternalAccount.providerType = authLoginObject.providerType;
    newExternalAccount.user = new SaveUserDto();
    newExternalAccount.user.nickname = authLoginObject.nickname;
    newExternalAccount.user.mailAddress = authLoginObject.mailAddress;

    return this.externalAccountsRepository.save(newExternalAccount);
  }
}
