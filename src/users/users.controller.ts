/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { User } from 'src/models/entity/user.entity';
import { UpdateUserDto } from 'src/models/dto/update-user.entity';
import { CreateProfileDto } from 'src/models/dto/create-profile.dto';
import { CreateEpisodeDto } from 'src/models/dto/create-episode.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query() filters: Record<string, any>
  ): Promise<User[]> {
    return this.usersService.findAllUsers(filters);
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  updateUserById(
    @Param('id' , ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto
    ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUserById(
    @Param('id', ParseIntPipe) id: number
    ) {
    return await this.usersService.deleteUserById(id);
    }

  @Post(':id/profiles')
  createUserProfiles(
    @Param('id',ParseIntPipe) id :number,
    @Body() createProfileDto: CreateProfileDto
    ){

        return this.usersService.createUserProfiles(id,createProfileDto);
  }

  @Post(':id/episodes')
  createUserEpisodes(
    @Param('id',ParseIntPipe) id :number,
    @Body() createEpisodesDto: CreateEpisodeDto
    ){

        return this.usersService.createUserEpisodes(id,createEpisodesDto);
  }




}
