import {
  Get,
  Controller,
  Render,
  Res,
  Body,
  Post,
  Param,
  Put,
  Query,
  Redirect,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { ComposersService } from '../playing-logs/composers/composers.service';
import { CountriesService } from '../playing-logs/countries/countries.service';
import { Country } from '../playing-logs/countries/countries.entity';
import { Composer } from '../playing-logs/composers/composers.entity';
// TODO 本家 handlebars.js には types があるのでそれが対応するの待ち？
// @ts-ignore: Could not find a declaration file for module
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
import { Playstyle } from '../playing-logs/playstyles/playstyles.entity';
import { SavePlaystyleDto } from '../playing-logs/playstyles/save-playstyle.dto';
import { PlaystylesService } from '../playing-logs/playstyles/playstyles.service';
import { GenresService } from '../playing-logs/genres/genres.service';
import { SaveGenreDto } from '../playing-logs/genres/save-genre.dto';
import { Genre } from '../playing-logs/genres/genres.entity';
import { Terms } from '../terms/terms.entity';
import { TermsService } from '../terms/terms.service';
import { SaveTermsDto } from '../terms/save-terms.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly composersService: ComposersService,
    private readonly countriesService: CountriesService,
    private readonly tunesService: TunesService,
    private readonly instrumentsService: InstrumentsService,
    private readonly playstylesService: PlaystylesService,
    private readonly genresService: GenresService,
    private readonly termsService: TermsService,
  ) {
    hbs.registerPartials(join(__dirname, '../..', 'views/admin/partials'));
    hbs.registerHelper(
      'isSelectedCountrty',
      (country: Country, composer: Composer) => {
        return composer.countries.some(
          (countrySelector: Country) => countrySelector.id === country.id,
        )
          ? 'selected'
          : null;
      },
    );
    hbs.registerHelper(
      'isSelectedComposer',
      (composer: Composer, tune: Tune) => {
        // composer がなければ null を返す(new の時)
        if (!tune.composer) {
          return null;
        }
        return composer.id === tune.composer.id ? 'selected' : null;
      },
    );

    hbs.registerHelper('isSelectedGenre', (genre: Genre, tune: Tune) => {
      // genres がなければ null を返す(何も紐づいてない時)
      if (!tune.genres) {
        return null;
      }
      return tune.genres.some(
        (genreSelector: Genre) => genreSelector.id === genre.id,
      )
        ? 'selected'
        : null;
    });
    hbs.registerHelper(
      'isSelectedPlaystyle',
      (playstyle: Playstyle, tune: Tune) => {
        // playstyle がなければ null を返す(new の時)
        if (!tune.playstyle) {
          return null;
        }
        return playstyle.id === tune.playstyle.id ? 'selected' : null;
      },
    );
  }
  @Get()
  @Render('admin/index')
  root() {
    return { title: 'yarilog管理画面' };
  }
  @Get('countries')
  @Render('admin/countries')
  async countries() {
    const countries: Country[] = await this.countriesService.findAll();
    return { countries, title: '国一覧' };
  }
  @Get('countries/new')
  @Render('admin/countries/editor')
  async newCountry() {
    const country: SaveCountryDto = new SaveCountryDto();
    return {
      country,
      title: '国新規作成',
      formaction: '/admin/countries/',
      showContinueButton: true,
    };
  }
  @Get('countries/:id/edit')
  @Render('admin/countries/editor')
  async editCountry(@Param('id') id: number) {
    const country: Country | undefined = await this.countriesService.findById(
      id,
    );
    return {
      country,
      title: `${country!.name}編集`,
      formaction: `/admin/countries/${id}?_method=PUT`,
    };
  }
  @Post('countries')
  async createCountry(
    @Res() res: Response,
    @Body() countryData: SaveCountryDto,
    @Query('isContinue') isContinue: string,
  ) {
    await this.countriesService.create(countryData);
    const redirectPath: string =
      isContinue === 'true' ? '/admin/countries/new' : '.';
    res.redirect(redirectPath);
  }
  @Put('countries/:id')
  @Redirect('/admin/countries')
  async updateCountry(
    @Param('id') id: number,
    @Body() countryData: SaveCountryDto,
  ) {
    await this.countriesService.update(id, countryData);
  }

  @Get('composers')
  @Render('admin/composers')
  async composers() {
    const composers: Composer[] = await this.composersService.findAll();
    return { composers, title: '作曲家一覧' };
  }
  @Get('composers/new')
  @Render('admin/composers/editor')
  async newComposer() {
    const composer: SaveComposerDto = new SaveComposerDto();
    const countries: Country[] = await this.countriesService.findAll();
    return {
      composer,
      countries,
      title: '作曲家新規作成',
      formaction: '/admin/composers/',
      showContinueButton: true,
    };
  }
  @Get('composers/:id/edit')
  @Render('admin/composers/editor')
  async editComposer(@Param('id') id: string) {
    const composer: Composer | undefined = await this.composersService.findById(
      id,
    );
    const countries: Country[] = await this.countriesService.findAll();
    return {
      composer,
      countries,
      title: `${composer!.displayName}編集`,
      formaction: `/admin/composers/${id}?_method=PUT`,
    };
  }
  @Post('composers')
  async createComposer(
    @Res() res: Response,
    @Body() composerData: SaveComposerDto,
    @Query('isContinue') isContinue: string,
  ) {
    composerData.countries = composerData.countryIds.map(
      (countryId: string) => {
        return { id: Number(countryId) };
      },
    );
    // ここのエンドポイントには admin 以外ありえない
    composerData.author = 'admin';
    await this.composersService.create(composerData);
    const redirectPath: string =
      isContinue === 'true' ? '/admin/composers/new' : '.';
    res.redirect(redirectPath);
  }
  /**
   * bulkComposerData より作曲家を一括登録する
   * 作曲家の重複はエラーが出る
   * @param bulkComposerData 表示名,フルネーム,国1,国2,国3
   */
  @Post('composers/bulk')
  @Redirect('/admin/composers', 301)
  async bulkCreateComposer(@Body('bulk') bulkComposerData: string) {
    // 改行コードで split してからそれぞれ , で split
    const composerDataArray = bulkComposerData
      .split(/\r?\n/g)
      .map(composer => composer.split(','));

    const countries = await this.countriesService.findAll();

    for await (const composerData of composerDataArray) {
      const saveComposerDto = new SaveComposerDto();
      saveComposerDto.displayName = composerData[0];
      saveComposerDto.fullName = composerData[1];
      saveComposerDto.author = 'admin';

      await this.findOrCreateAddCountry(
        composerData[2],
        countries,
        saveComposerDto,
      );

      await this.findOrCreateAddCountry(
        composerData[3],
        countries,
        saveComposerDto,
      );
      await this.findOrCreateAddCountry(
        composerData[4],
        countries,
        saveComposerDto,
      );

      await this.composersService.create(saveComposerDto);
    }
  }
  /**
   * 与えたれた国名があれば、与えられた国リストから探して返し、無ければ作って国リストに加える
   * その後 saveComposerDto に追加する
   * @param countryName
   * @param countries
   * @param saveComposerDto
   */
  private async findOrCreateAddCountry(
    countryName: string,
    countries: Country[],
    saveComposerDto: SaveComposerDto,
  ): Promise<void> {
    if (countryName !== '') {
      let country = countries.find(c => c.name === countryName);
      // 国が無ければ新規作成
      if (!country) {
        const saveCountryDto = new SaveCountryDto();
        saveCountryDto.name = countryName;
        country = await this.countriesService.create(saveCountryDto);
        countries.push(country);
      }
      saveComposerDto.countries.push(country);
    }
  }
  @Put('composers/:id')
  @Redirect('/admin/composers')
  async updateComposer(
    @Param('id') id: string,
    @Body() composerData: SaveComposerDto,
  ) {
    composerData.id = Number(id);
    composerData.countries = Array.isArray(composerData.countryIds)
      ? (composerData.countries = composerData.countryIds.map(
          (countryId: string) => {
            return { id: Number(countryId) };
          },
        ))
      : [];
    await this.composersService.update(composerData);
  }
  @Get('composers/:id/tunes')
  @Render('admin/composers/tunes')
  async composersTunes(@Param('id') id: string) {
    const composer = await this.composersService.findById(id);
    const tunes = await this.tunesService.findAllByComposerId(id);
    return {
      tunes,
      composerId: composer!.id,
      title: `${composer!.displayName}曲一覧`,
      formaction: `/admin/composers/${id}?_method=PUT`,
    };
  }

  @Get('tunes')
  @Render('admin/tunes')
  async tunes() {
    const composers: Composer[] = await this.composersService.findAll();
    return { composers, title: '曲一覧？' };
  }
  @Get('tunes/new')
  @Render('admin/tunes/editor')
  async newTune(@Query('composerId') composerId: string) {
    const tune: SaveTuneDto = new SaveTuneDto();
    tune.composer = { id: composerId };
    const composers: Composer[] = await this.composersService.findAll();
    const playstyles: Playstyle[] = await this.playstylesService.findAll();
    const genres: Genre[] = await this.genresService.findAll();
    return {
      tune,
      composers,
      playstyles,
      genres,
      title: '曲新規作成',
      formaction: '/admin/tunes/',
      showContinueButton: true,
    };
  }
  @Get('tunes/:id/edit')
  @Render('admin/tunes/editor')
  async editTune(@Param('id') id: number) {
    const tune: Tune | undefined = await this.tunesService.findById(id);
    const composers: Composer[] = await this.composersService.findAll();
    const playstyles: Playstyle[] = await this.playstylesService.findAll();
    const genres: Genre[] = await this.genresService.findAll();
    return {
      tune,
      composers,
      playstyles,
      genres,
      title: `${tune!.title}編集`,
      formaction: `/admin/tunes/${id}?_method=PUT`,
    };
  }
  @Post('tunes')
  async createTune(
    @Res() res: Response,
    @Body() tuneData: SaveTuneDto,
    @Query('isContinue') isContinue: string,
  ) {
    tuneData.composer = { id: tuneData.composerId };
    tuneData.playstyle = { id: tuneData.playstyleId };
    tuneData.genres = (tuneData.genreIds ? tuneData.genreIds : []).map(
      (genreId: string) => {
        return { id: Number(genreId) };
      },
    );
    // ここのエンドポイントには admin 以外ありえない
    tuneData.author = 'admin';
    await this.tunesService.create(tuneData);
    const redirectPath: string =
      isContinue === 'true' ? '/admin/tunes/new' : '.';
    res.redirect(redirectPath);
  }
  /**
   * bulkComposerData より作曲家を一括登録する
   * 作曲家の重複はエラーが出る
   * @param bulkTuneData 作曲家表示名,タイトル,演奏形態,ジャンル1,ジャンル2,ジャンル3,ジャンル4,ジャンル5,ジャンル6,ジャンル7
   */
  @Post('tunes/bulk')
  @Redirect('/admin/tunes', 301)
  async bulkCreateTune(@Body('bulk') bulkTuneData: string) {
    // 改行コードで split してからそれぞれ , で split
    const tuneDataArray = bulkTuneData
      .split(/\r?\n/g)
      .map(tune => tune.split(','));

    const composers = await this.composersService.findAll();
    const plyastyles = await this.playstylesService.findAll();
    const genres = await this.genresService.findAll();

    for await (const tuneData of tuneDataArray) {
      const saveTuneDto = new SaveTuneDto();
      // 作曲家は存在することとする
      saveTuneDto.composer = composers.find(
        c => c.displayName === tuneData[0],
      )!;
      saveTuneDto.title = tuneData[1];
      // 演奏形態も存在することとする
      saveTuneDto.playstyle = plyastyles.find(p => p.name === tuneData[2])!;
      saveTuneDto.author = 'admin';

      await this.findOrCreateAddGenre(tuneData[3], genres, saveTuneDto);
      await this.findOrCreateAddGenre(tuneData[4], genres, saveTuneDto);
      await this.findOrCreateAddGenre(tuneData[5], genres, saveTuneDto);
      await this.findOrCreateAddGenre(tuneData[6], genres, saveTuneDto);
      await this.findOrCreateAddGenre(tuneData[7], genres, saveTuneDto);
      await this.findOrCreateAddGenre(tuneData[8], genres, saveTuneDto);
      await this.findOrCreateAddGenre(tuneData[9], genres, saveTuneDto);

      await this.tunesService.create(saveTuneDto);
    }
  }

  /**
   * 与えたれたジャンル名があれば、与えられたジャンルリストから探して返し、無ければ作ってジャンルリストに加える
   * その後 saveTuneDto に追加する
   * @param genreName
   * @param genres
   * @param saveTuneDto
   */
  private async findOrCreateAddGenre(
    genreName: string,
    genres: Genre[],
    saveTuneDto: SaveTuneDto,
  ): Promise<void> {
    if (genreName !== '') {
      let genre = genres.find(g => g.name === genreName);
      // 国が無ければ新規作成
      if (!genre) {
        const saveGenreDto = new SaveGenreDto();
        saveGenreDto.name = genreName;
        genre = await this.genresService.create(saveGenreDto);
        genres.push(genre);
      }
      saveTuneDto.genres.push(genre);
    }
  }
  @Put('tunes/:id')
  @Redirect('/admin/tunes')
  async updateTune(@Param('id') id: number, @Body() tuneData: SaveTuneDto) {
    tuneData.id = Number(id);
    tuneData.composer = { id: tuneData.composerId };
    tuneData.playstyle = { id: tuneData.playstyleId };
    tuneData.genres = Array.isArray(tuneData.genreIds)
      ? (tuneData.genres = tuneData.genreIds.map((genreId: string) => {
          return { id: Number(genreId) };
        }))
      : [];
    await this.tunesService.update(tuneData);
  }

  @Get('instruments')
  @Render('admin/instruments')
  async instruments() {
    const instruments: Instrument[] = await this.instrumentsService.findAll();
    return { instruments, title: '楽器一覧' };
  }
  @Get('instruments/new')
  @Render('admin/instruments/editor')
  async newInstrument() {
    const instrument: SaveInstrumentDto = new SaveInstrumentDto();
    return {
      instrument,
      title: '楽器新規作成',
      formaction: '/admin/instruments/',
      showContinueButton: true,
    };
  }
  @Get('instruments/:id/edit')
  @Render('admin/instruments/editor')
  async editInstrument(@Param('id') id: number) {
    const instrument:
      | Instrument
      | undefined = await this.instrumentsService.findById(id);
    return {
      instrument,
      title: `${instrument!.name}編集`,
      formaction: `/admin/instruments/${id}?_method=PUT`,
    };
  }
  @Post('instruments')
  async createInstrument(
    @Res() res: Response,
    @Body() instrumentData: SaveInstrumentDto,
    @Query('isContinue') isContinue: string,
  ) {
    await this.instrumentsService.create(instrumentData);
    const redirectPath: string =
      isContinue === 'true' ? '/admin/instruments/new' : '.';
    res.redirect(redirectPath);
  }
  @Put('instruments/:id')
  @Redirect('/admin/instruments')
  async updateInstrument(
    @Param('id') id: number,
    @Body() instrumentData: SaveInstrumentDto,
  ) {
    await this.instrumentsService.update(id, instrumentData);
  }
  @Get('playstyles')
  @Render('admin/playstyles')
  async playstyles() {
    const playstyles: Playstyle[] = await this.playstylesService.findAll();
    return { playstyles, title: '演奏形態一覧' };
  }
  @Get('playstyles/new')
  @Render('admin/playstyles/editor')
  async newPlaystyle() {
    const playstyle: SavePlaystyleDto = new SavePlaystyleDto();
    return {
      Playstyle,
      title: '演奏形態新規作成',
      formaction: '/admin/playstyles/',
      showContinueButton: true,
    };
  }
  @Get('playstyles/:id/edit')
  @Render('admin/playstyles/editor')
  async editPlaystyle(@Param('id') id: number) {
    const playstyle:
      | Playstyle
      | undefined = await this.playstylesService.findById(id);
    return {
      playstyle,
      title: `${playstyle!.name}編集`,
      formaction: `/admin/playstyles/${id}?_method=PUT`,
    };
  }
  @Post('playstyles')
  async createPlaystyle(
    @Res() res: Response,
    @Body() playstyleData: SavePlaystyleDto,
    @Query('isContinue') isContinue: string,
  ) {
    await this.playstylesService.create(playstyleData);
    const redirectPath: string =
      isContinue === 'true' ? '/admin/playstyles/new' : '.';
    res.redirect(redirectPath);
  }
  @Put('playstyles/:id')
  @Redirect('/admin/playstyles')
  async updatePlaystyle(
    @Param('id') id: number,
    @Body() playstyleData: SavePlaystyleDto,
  ) {
    await this.playstylesService.update(id, playstyleData);
  }

  @Get('genres')
  @Render('admin/genres')
  async genres() {
    const genres: Genre[] = await this.genresService.findAll();
    return { genres, title: 'ジャンル一覧' };
  }
  @Get('genres/new')
  @Render('admin/genres/editor')
  async newGenre() {
    const genre: SaveGenreDto = new SaveGenreDto();
    return {
      genre,
      title: 'ジャンル新規作成',
      formaction: '/admin/genres/',
      showContinueButton: true,
    };
  }
  @Get('genres/:id/edit')
  @Render('admin/genres/editor')
  async editGenre(@Param('id') id: number) {
    const genre: Genre | undefined = await this.genresService.findById(id);
    return {
      genre,
      title: `${genre!.name}編集`,
      formaction: `/admin/genres/${id}?_method=PUT`,
    };
  }
  @Post('genres')
  async createGenre(
    @Res() res: Response,
    @Body() genreData: SaveGenreDto,
    @Query('isContinue') isContinue: string,
  ) {
    await this.genresService.create(genreData);
    const redirectPath: string =
      isContinue === 'true' ? '/admin/genres/new' : '.';
    res.redirect(redirectPath);
  }
  @Put('genres/:id')
  @Redirect('/admin/genres')
  async updateGenre(@Param('id') id: number, @Body() genreData: SaveGenreDto) {
    await this.genresService.update(id, genreData);
  }
  @Get('terms')
  @Render('admin/terms')
  async terms() {
    const termsList: Terms[] = await this.termsService.findAll();
    return { termsList, title: '規約一覧' };
  }
  @Get('terms/new')
  @Render('admin/terms/editor')
  async newTerms() {
    const terms: SaveTermsDto = new SaveTermsDto();
    return {
      terms,
      title: '規約新規作成',
      formaction: '/admin/terms/',
    };
  }
  @Get('terms/:id/edit')
  @Render('admin/terms/editor')
  async editTerms(@Param('id') id: number) {
    const terms: Terms | undefined = await this.termsService.findById(id);
    return {
      terms,
      title: `ver ${terms!.id} 編集`,
      formaction: `/admin/terms/${id}?_method=PUT`,
    };
  }
  @Post('terms')
  async createTerms(@Res() res: Response, @Body() genreData: SaveTermsDto) {
    await this.termsService.create(genreData);
    res.redirect('.');
  }
  @Put('terms/:id')
  @Redirect('/admin/terms')
  async updateTerms(@Param('id') id: number, @Body() termsData: SaveTermsDto) {
    await this.termsService.update(id, termsData);
  }

  @Get('users')
  @Render('admin/users')
  async users() {
    const users: User[] = await this.usersService.findAll(true);
    return { users, title: 'ユーザ一覧' };
  }
  @Get('aggrAveragePoint/tunes/all')
  async aggrAveragePointAllTunes(@Res() res: Response) {
    await this.tunesService.allAgrAveragePointAndSave();
    res.redirect('/admin/tunes');
  }
  // TODO 実装
  // @Get("aggrAveragePoint/tunes/:id")
  // async aggrAveragePointTune() {
  // }
}
