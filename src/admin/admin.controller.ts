import { Get, Controller, Render, Res, Body, Post, Param, Put } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { ComposersService } from 'src/playing-logs/composers/composers.service';
import { CountriesService } from 'src/playing-logs/countries/countries.service';
import { Country } from 'src/playing-logs/countries/countries.entity';
import { Composer } from 'src/playing-logs/composers/composers.entity';
import * as hbs from 'hbs';
import { join } from 'path';
import { SaveCountryDto } from 'src/playing-logs/countries/save-country.dto';
import { SaveComposerDto } from 'src/playing-logs/composers/save-composer.dto';

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
  @Get("countries/new")
  @Render('admin/countries/editor')
  async newCountry() {
    const country: SaveCountryDto = new SaveCountryDto();
    return { country: country, title: '国新規作成', formaction: '/admin/countries/'};
  }
  @Get("countries/:id/edit")
  @Render('admin/countries/editor')
  async editCountry(@Param('id') id: number) {
    const country: Country = await this.countriesService.findById(id);
    return { country: country, title: `${country.name}編集`, formaction: `/admin/countries/${id}?_method=PUT`}
  }
  @Post("countries")
  async createCountry(@Res() res: Response, @Body() countryData: SaveCountryDto) {
    await this.countriesService.create(countryData);
    // TODO 作成を続けるかどうかで遷移先を分ける
    const redirectPath: string = '.';
    res.redirect(redirectPath);
  }
  @Put("countries/:id")
  async updateCountry(@Res() res: Response, @Param('id') id: number, @Body() countryData: SaveCountryDto) {
    await this.countriesService.update(id, countryData);
    // TODO 作成を続けるかどうかで遷移先を分ける
    const redirectPath: string = '.';
    res.redirect(redirectPath);
  }

  @Get("composers")
  @Render('admin/composers')
  async composers() {
    const composers: Composer[] = await this.composersService.findAll();
    return { composers: composers, title: '作曲家一覧'  };
  }
  @Get("composers/new")
  @Render('admin/composers/editor')
  async newComposer() {
    const composer: SaveComposerDto = new SaveComposerDto();
    const countries: Country[] = await this.countriesService.findAll();
    return { composer: composer, countries: countries, title: '作曲家新規作成', formaction: '/admin/composers/'};
  }
  @Get("composers/:id/edit")
  @Render('admin/composers/editor')
  async editComposer(@Param('id') id: string) {
    const composer: Composer = await this.composersService.findById(id);
    const countries: Country[] = await this.countriesService.findAll();
    return { composer: composer, countries: countries, title: `${composer.lastName}編集`, formaction: `/admin/composers/${id}?_method=PUT`};
  }
  @Post("composers")
  async createComposer(@Res() res: Response, @Body() composerData: SaveComposerDto) {
    composerData.countries = (composerData.countryIds).map((countryId: string) => {
      return {id: Number(countryId)}
    });
    await this.composersService.create(composerData);
    // TODO 作成を続けるかどうかで遷移先を分ける
    const redirectPath: string = '.';
    res.redirect(redirectPath);
  }
  @Put("composers/:id")
  async updateComposer(@Res() res: Response, @Param('id') id: string, @Body() composerData: SaveComposerDto) {
    composerData.id = Number(id);
    composerData.countries = Array.isArray(composerData.countryIds) ? 
      composerData.countries = composerData.countryIds.map((countryId: string) => {
        return {id: Number(countryId)}
      })
      : [];
    await this.composersService.update(composerData);
    // TODO 作成を続けるかどうかで遷移先を分ける
    const redirectPath: string = '.';
    res.redirect(redirectPath);
  }
  @Get("users")
  @Render('admin/users')
  async users() {
    const users: User[] = await this.usersService.findAll();
    return { users: users, title: 'ユーザ一覧' };
  }
}
