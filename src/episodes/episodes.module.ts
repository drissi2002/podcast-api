import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/entity/user.entity';
import { Episode } from 'src/models/entity/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Episode])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
