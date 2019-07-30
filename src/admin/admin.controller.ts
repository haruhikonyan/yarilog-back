import { Get, Controller, Render, Res, Body, Post, Param, Put, Query } from '@nestjs/common';
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
import { InstrumentsService } from '../playing-logs/instruments/instruments.service';

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
    hbs.registerHelper('isSelectedCountrty', (country: Country, composer: Composer) => {
      return composer.countries.some((countrySelector: Country) => countrySelector.id === country.id) ? 'selected' : null;
    })
    hbs.registerHelper('isSelectedComposer', (composer: Composer, tune: Tune) => {
      // tune がなければ null を返す(new の時)
      if (!tune.composer) { return null }
      return composer.id === tune.composer.id ? 'selected' : null;
    })
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
    return { country: country, title: '国新規作成', formaction: '/admin/countries/', showContinueButton: true };
  }
  @Get("countries/:id/edit")
  @Render('admin/countries/editor')
  async editCountry(@Param('id') id: number) {
    const country: Country = await this.countriesService.findById(id);
    return { country: country, title: `${country.name}編集`, formaction: `/admin/countries/${id}?_method=PUT`}
  }
  @Post("countries")
  async createCountry(@Res() res: Response, @Body() countryData: SaveCountryDto, @Query('isContinue') isContinue: string) {
    await this.countriesService.create(countryData);
    const redirectPath: string = isContinue === 'true' ? '/admin/countries/new' : '.';
    res.redirect(redirectPath);
  }
  @Put("countries/:id")
  @Render('admin/countries')
  async updateCountry(@Param('id') id: number, @Body() countryData: SaveCountryDto) {
    await this.countriesService.update(id, countryData);
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
    return { composer: composer, countries: countries, title: '作曲家新規作成', formaction: '/admin/composers/', showContinueButton: true };
  }
  @Get("composers/:id/edit")
  @Render('admin/composers/editor')
  async editComposer(@Param('id') id: string) {
    const composer: Composer = await this.composersService.findById(id);
    const countries: Country[] = await this.countriesService.findAll();
    return { composer: composer, countries: countries, title: `${composer.lastName}編集`, formaction: `/admin/composers/${id}?_method=PUT`};
  }
  @Post("composers")
  async createComposer(@Res() res: Response, @Body() composerData: SaveComposerDto, @Query('isContinue') isContinue: string) {
    composerData.countries = (composerData.countryIds).map((countryId: string) => {
      return {id: Number(countryId)}
    });
    await this.composersService.create(composerData);
    const redirectPath: string = isContinue === 'true' ? '/admin/composers/new' : '.';
    res.redirect(redirectPath);
  }
  @Put("composers/:id")
  @Render('admin/composers')
  async updateComposer(@Param('id') id: string, @Body() composerData: SaveComposerDto) {
    composerData.id = Number(id);
    composerData.countries = Array.isArray(composerData.countryIds) ? 
      composerData.countries = composerData.countryIds.map((countryId: string) => {
        return {id: Number(countryId)}
      })
      : [];
    await this.composersService.update(composerData);
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
    const composers: Composer[] = await this.composersService.findAll();
    return { tune: tune, composers: composers, title: '曲新規作成', formaction: '/admin/tunes/', showContinueButton: true };
  }
  @Get("tunes/:id/edit")
  @Render('admin/tunes/editor')
  async editTune(@Param('id') id: number) {
    const tune: Tune = await this.tunesService.findById(id);
    const composers: Composer[] = await this.composersService.findAll();
    return { tune: tune, composers: composers, title: `${tune.title}編集`, formaction: `/admin/tunes/${id}?_method=PUT`}
  }
  @Post("tunes")
  async createTune(@Res() res: Response, @Body() tuneData: SaveTuneDto, @Query('isContinue') isContinue: string) {
    tuneData.composer = { id: tuneData.composerId }
    await this.tunesService.create(tuneData);
    const redirectPath: string = isContinue === 'true' ? '/admin/tunes/new' : '.';
    res.redirect(redirectPath);
  }
  @Put("tunes/:id")
  @Render('admin/tunes')
  async updateTune(@Param('id') id: number, @Body() tuneData: SaveTuneDto) {
    tuneData.composer = { id: tuneData.composerId }
    await this.tunesService.update(id, tuneData);
  }

  @Get("instruments")
  @Render('admin/instruments')
  async instruments() {
    const instruments: Instrument[] = await this.instrumentsService.findAll();
    return { instruments: instruments, title: '楽器一覧' };
  }
  @Get("instruments/new")
  @Render('admin/instruments/editor')
  async newInstrument() {
    const instrument: SaveInstrumentDto = new SaveInstrumentDto();
    return { instrument: instrument, title: '楽器新規作成', formaction: '/admin/instruments/', showContinueButton: true };
  }
  @Get("instruments/:id/edit")
  @Render('admin/instruments/editor')
  async editInstrument(@Param('id') id: number) {
    const instrument: Instrument = await this.instrumentsService.findById(id);
    return { instrument: instrument, title: `${instrument.name}編集`, formaction: `/admin/instruments/${id}?_method=PUT`}
  }
  @Post("instruments")
  async createInstrument(@Res() res: Response, @Body() instrumentData: SaveInstrumentDto, @Query('isContinue') isContinue: string) {
    await this.instrumentsService.create(instrumentData);
    const redirectPath: string = isContinue === 'true' ? '/admin/instruments/new' : '.';
    res.redirect(redirectPath);
  }
  @Put("instruments/:id")
  @Render('admin/instruments')
  async updateInstrument(@Param('id') id: number, @Body() instrumentData: SaveInstrumentDto) {
    await this.instrumentsService.update(id, instrumentData);
  }

  @Get("users")
  @Render('admin/users')
  async users() {
    const users: User[] = await this.usersService.findAll();
    return { users: users, title: 'ユーザ一覧' };
  }
}
