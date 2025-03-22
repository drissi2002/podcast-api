/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Episode } from '../models/entity/episode.entity';
import { randomUUID } from 'crypto';
import { CreateEpisodeDto } from '../models/dto/create-episode.dto';

@Injectable()
export class EpisodesService {

      // Mock data for testing
  private espisodes: Episode[] = [
    {
      id: '55ddd9cd-2a41-44cf-b245-1e00bc572804',
      title: 'First Episode',
      featured: true,
      publishedAt: new Date(),
      user: null,
    },
    {
      id: '55e240bb-2acf-42ff-9ed8-f0461c75879e',
      title: 'Second Episode',
      featured: false,
      publishedAt: new Date(),
      user: null,
    },
    {
      id: '49dd7a87-f90a-45cd-a268-e862c4ccf3b3',
      title: 'Third Episode',
      featured: true,
      publishedAt: new Date(),
      user: null,
    },
  ];

    async findAll(sort : 'asc' | 'desc' = 'asc'){
    
        const sortAsc = (a:Episode, b:Episode) => (a.title > b.title ? 1 : -1);
        const sortDesc = (a:Episode, b:Episode) => (a.title < b.title ? 1 : -1);

        return sort === 'asc' ? this.espisodes.sort(sortAsc) : this.espisodes.sort(sortDesc);
    }

    async findFeatured(){
        return this.espisodes.filter((episode) => episode.featured);
    }

    async findOne(id: string): Promise<Episode | undefined> {
        return this.espisodes.find((episode) => episode.id === id);
    }

    async create(createEpiosdeDto: CreateEpisodeDto){
        const createdEpisode = {
            ...createEpiosdeDto,
            user : null,
            id: randomUUID(),
        }
        this.espisodes.push(createdEpisode);
        return createdEpisode;

    }

}
