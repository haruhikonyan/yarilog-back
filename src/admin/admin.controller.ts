import { Get, Controller, Render, Res, Body, Post, Param, Put } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { ComposersService } from '../playing-logs/composers/composers.service';
import { CountriesService } from '../playing-logs/countries/countries.service';
import { Country } from '../playing-logs/countries/countries.entity';
import { Composer } from '../playing-logs/composers/composers.entity';
import * as hbs from 'hbs';
import { join } from 'path';
import { SaveCountryDto } from '../playing-logs/countries/save-country.dto';
import { SaveComposerDto } from '../playing-logs/composers/save-composer.dto';
import { Tune } from '../playing-logs/tunes/tunes.entity';
import { SaveTuneDto } from '../playing-logs/tunes/save-tune.dto';
import { TunesService } from '../playing-logs/tunes/tunes.service';
import { Instrument } from '../playing-logs/instruments/instruments.entity';
import { SaveInstrumentDto } from '../playing-logs/instruments/save-instrument.dto';
import { InstrumentsService } from 'src/playing-logs/instruments/instruments.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly composersService: ComposersService,
    private readonly countriesService: CountriesService,
    private readonly tunesService: TunesService,
    private readonly instrumentsService: InstrumentsService,
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
    hbs.registerHelper('isSelectedCountrty', (country: Country) => {
      return composer.countries.some((countrySelector: Country) => countrySelector.id === country.id) ? 'selected' : null;
    })
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

  @Get("tunes")
  @Render('admin/tunes')
  async tunes() {
    const tunes: Tune[] = await this.tunesService.findAll();
    return { tunes: tunes, title: '曲一覧' };
  }
  @Get("tunes/new")
  @Render('admin/tunes/editor')
  async newTune() {
    const tune: SaveTuneDto = new SaveTuneDto();
    return { tune: tune, title: '曲新規作成', formaction: '/admin/tunes/'};
  }
  @Get("tunes/:id/edit")
  @Render('admin/tunes/editor')
  async editTune(@Param('id') id: number) {
    const tune: Tune = await this.tunesService.findById(id);
    const composers: Composer[] = await this.composersService.findAll();
    hbs.registerHelper('isSelectedComposer', (composer: Composer) => {
      return composer.id === tune.composer.id ? 'selected' : null;
    })
    return { tune: tune, composers: composers, title: `${tune.title}編集`, formaction: `/admin/tunes/${id}?_method=PUT`}
  }
  @Post("tunes")
  async createTune(@Res() res: Response, @Body() tuneData: SaveTuneDto) {
    await this.tunesService.create(tuneData);
    // TODO 作成を続けるかどうかで遷移先を分ける
    const redirectPath: string = '.';
    res.redirect(redirectPath);
  }
  @Put("tunes/:id")
  async updateTune(@Res() res: Response, @Param('id') id: number, @Body() tuneData: SaveTuneDto) {
    await this.tunesService.update(id, tuneData);
    // TODO 作成を続けるかどうかで遷移先を分ける
    const redirectPath: string = '.';
    res.redirect(redirectPath);
  }

  @Get("instruments")
  @Render('admin/instruments')
  async instruments() {
    const instruments: Instrument[] = await this.instrumentsService.findAll();
    return { instruments: instruments, title: '曲一覧' };
  }
  @Get("instruments/new")
  @Render('admin/instruments/editor')
  async newInstrument() {
    const instrument: SaveInstrumentDto = new SaveInstrumentDto();
    return { instrument: instrument, title: '曲新規作成', formaction: '/admin/instruments/'};
  }
  @Get("instruments/:id/edit")
  @Render('admin/instruments/editor')
  async editInstrument(@Param('id') id: number) {
    const instrument: Instrument = await this.instrumentsService.findById(id);
    return { instrument: instrument, title: `${instrument.name}編集`, formaction: `/admin/instruments/${id}?_method=PUT`}
  }
  @Post("instruments")
  async createInstrument(@Res() res: Response, @Body() instrumentData: SaveInstrumentDto) {
    await this.instrumentsService.create(instrumentData);
    // TODO 作成を続けるかどうかで遷移先を分ける
    const redirectPath: string = '.';
    res.redirect(redirectPath);
  }
  @Put("instruments/:id")
  async updateInstrument(@Res() res: Response, @Param('id') id: number, @Body() instrumentData: SaveInstrumentDto) {
    await this.instrumentsService.update(id, instrumentData);
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
