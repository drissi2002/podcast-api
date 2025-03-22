/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from '../models/dto/create-episode.dto';
import { ConfigModule } from '../config/config.module';
import { before } from 'node:test';

describe('EpisodesController', () => {
  let controller: EpisodesController;
  //let service : EpisodesService;

  const mockFindOne = jest.fn();

  const mockEpisodesServiceAsync = {
    findAll: async () => [{ id: 'id' }],
    findFeatured: async () => [{ id: 'id' }],
    findOne: mockFindOne,
    create: async () => ({ id: 'id' }),
  };

  const mockEpisodesService = {
    findAll: jest.fn().mockResolvedValue([
      { id: '1', title: 'Featured Episode 1', featured: true },
      { id: '2', title: 'Featured Episode 2', featured: true },
    ]),
    findFeatured: jest.fn().mockResolvedValue([
      { id: '1', title: 'Featured Episode 1', featured: true },
      { id: '2', title: 'Featured Episode 2', featured: true },
    ]),
    findOne: jest.fn().mockImplementation((id: string) => ({
      id,
      title: `Episode ${id}`,
      featured: false,
    })),
    create: jest.fn().mockImplementation((dto: CreateEpisodeDto) => ({
      id: '3',
      ...dto,
    })),
  };

  beforeEach(async () => {
    jest.resetAllMocks(); // for test isolation
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [EpisodesController],
      providers: [
        {
          provide: EpisodesService,
          useValue: mockEpisodesServiceAsync,
          // useValue:{
          //   findAll: jest.fn().mockResolvedValue([
          //     { id: '1', title: 'Featured Episode 1', featured: true },
          //     { id: '2', title: 'Featured Episode 2', featured: true },
          //   ]),
          //   findFeatured: jest.fn().mockResolvedValue([
          //     { id: '1', title: 'Featured Episode 1', featured: true },
          //     { id: '2', title: 'Featured Episode 2', featured: true },
          //   ]),
          //   findOne: jest.fn().mockImplementation((id: string) => ({
          //     id,
          //     title: `Episode ${id}`,
          //     featured: false,
          //   })),
          //   create: jest.fn().mockImplementation((dto: CreateEpisodeDto) => ({
          //     id: '3',
          //     ...dto,
          //   })),
          // }
        },
      ],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
    //service = module.get<EpisodesService>(EpisodesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should return featured episodes', async () => {
  //   expect(await controller.findFeatured()).toEqual([
  //     { id: '1', title: 'Featured Episode 1', featured: true },
  //     { id: '2', title: 'Featured Episode 2', featured: true },
  //   ]);
  //   expect(service.findFeatured).toHaveBeenCalled();
  // });

  // it('should return an episode by id', async () => {
  //   const id = '1';
  //   expect(await controller.findOne(id)).toEqual({
  //     id,
  //     title: `Episode ${id}`,
  //     featured: false,
  //   });
  //   expect(service.findOne).toHaveBeenCalledWith(id);
  // });

  // it('should create a new episode', async () => {
  //   const createEpisodeDto: CreateEpisodeDto = {
  //     title: 'New Episode',
  //     featured: false,
  //   };

  //   expect(await controller.create(createEpisodeDto)).toEqual({
  //     id: '3',
  //     ...createEpisodeDto,
  //   });
  //   expect(service.create).toHaveBeenCalledWith(createEpisodeDto);
  // });

  describe('findOne', () => {
    const episodeId = 'id';
    const mockResult = { id: episodeId, name: 'JAVA EPISODE' };

    beforeEach(() => {
      mockFindOne.mockResolvedValue(mockResult);
    });

    it('should return an episode by id', async () => {
      await controller.findOne(episodeId);
      expect(mockFindOne).toHaveBeenCalledWith(episodeId);
    });

    it('should return the found episode', async () => {
      const result = await controller.findOne(episodeId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('when an episode is not found', () => {
    const episodeId = 'id';

    beforeEach(() => {
      mockFindOne.mockResolvedValue(null);
    });

    it('should throw an error', async () => {
      await expect(controller.findOne(episodeId)).rejects.toThrow(
        'Episode not found',
      );
    });
  });
});
