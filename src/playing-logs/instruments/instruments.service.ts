import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instrument } from './instruments.entity';
import { SaveInstrumentDto } from './save-instrument.dto';

@Injectable()
export class InstrumentsService {
	constructor(
		@InjectRepository(Instrument)
		private readonly instrumentsRepository: Repository<Instrument>,
  ) {}

	async findAll(): Promise<Instrument[]> {
		return await this.instrumentsRepository.find();
	}

  async findById(id: number | string): Promise<Instrument | undefined> {
    return await this.instrumentsRepository.findOne(id);
  }

  async create(instrumentData: SaveInstrumentDto): Promise<Instrument> {
    const instrument = await this.instrumentsRepository.create(instrumentData);
    return await this.instrumentsRepository.save(instrument);
  }

  async update(id: number, instrumentData: SaveInstrumentDto): Promise<Instrument | undefined> {
    const instrument = await this.findById(id);
    // 存在しなければ undefined を返す
    if (instrument == null) {
      return undefined;
    }
    await this.instrumentsRepository.merge(instrument, instrumentData);
    return await this.instrumentsRepository.save(instrument);
  }

}
