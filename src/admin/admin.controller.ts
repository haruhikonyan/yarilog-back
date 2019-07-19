import { Get, Controller, Render } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { ComposersService } from 'src/playing-logs/composers/composers.service';
import { CountriesService } from 'src/playing-logs/countries/countries.service';
import { Country } from 'src/playing-logs/countries/countries.entity';
import { Composer } from 'src/playing-logs/composers/composers.entity';
import * as hbs from 'hbs';
import { join } from 'path';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly composersService: ComposersService,
    private readonly countriesService: CountriesService,
  ) {
    hbs.registerPartials(join(__dirname, '../..', 'views/admin/partials'));
  }
  @Get()
  @Render('admin/index')
  root() {
    return { title:'yarilog管理画面' };
  }
  @Get("countries")
  @Render('admin/countries')
  async countries() {
    const countries: Country[] = await this.countriesService.findAll();
    return { countries: countries, title: '国一覧' };
  }
  @Get("composers")
  @Render('admin/composers')
  async composers() {
    const composers: Composer[] = await this.composersService.findAll();
    return { composers: composers, title: '作曲家一覧'  };
  }
  @Get("users")
  @Render('admin/users')
  async users() {
    const users: User[] = await this.usersService.findAll();
    return { users: users, title: 'ユーザ一覧'  };
  }
}
