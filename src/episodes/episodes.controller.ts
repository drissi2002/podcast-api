/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from '../models/dto/create-episode.dto';
import { NotFoundFilter } from '../exceptions/not-found-filter.exception';
import { IsPostivePipe } from '../pipes/is-postive/is-postive.pipe';
//import { AuthGuard } from '../guards/auth.guard';


// @UseGuards(ApiKeyGuard)
@Controller('episodes')
@UseFilters(NotFoundFilter)
export class EpisodesController {
  constructor(
    private episodesService: EpisodesService
  ) {}

  @Get()
  findAll(
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('limit', new DefaultValuePipe(2), ParseIntPipe, IsPostivePipe)
    limit: number,
  ) {
    return this.episodesService.findAll(sort);
  }

  @Get('featured')
  findFeatured() {
    return this.episodesService.findFeatured();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const episode = await this.episodesService.findOne(id);
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    return episode;
  }

  // @UseGuards(AuthGuard)
  @Post()
  create(@Body(ValidationPipe) input: CreateEpisodeDto) {
    return this.episodesService.create(input);
  }
}
