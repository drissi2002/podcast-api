/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { User } from '../models/entity/user.entity';
import { UpdateUserDto } from 'src/models/dto/update-user.entity';
import { DuplicateEntryException } from 'src/exceptions/duplicate-entry-exception.entity';
import { RoleEntity } from 'src/models/entity/role.entity';
import { Profile } from 'src/models/entity/profile.entity';
import { faker } from '@faker-js/faker'; // Import faker
import { Role } from 'src/models/enum/role.enum';
import { CreateProfileDto } from 'src/models/dto/create-profile.dto';
import { Episode } from 'src/models/entity/episode.entity';
import { CreateEpisodeDto } from 'src/models/dto/create-episode.dto';


//FIXME: This is a mock data. You should implement a real database.
const users: User[] = [
    {
      userId: 1,
      username: faker.internet.username(),
      password: faker.internet.password(),
      createdAt: faker.date.past(),
      authStrategy: faker.helpers.arrayElement(['google', 'facebook', 'twitter']),
      updatedAt: faker.date.recent(),
      profile: new Profile(),
      role: new RoleEntity(),
      episodes: [ // Add random episodes to the user
        new Episode(),
        new Episode(),
      ],
    },
    {
      userId: 2,
      username: faker.internet.username(),
      password: faker.internet.password(),
      createdAt: faker.date.past(),
      authStrategy: faker.helpers.arrayElement(['google', 'facebook', 'twitter']),
      updatedAt: faker.date.recent(),
      profile: new Profile(),
      role: new RoleEntity(),
      episodes: [
        new Episode(),
        new Episode(),
      ],
    },
    {
      userId: 3,
      username: faker.internet.username(),
      password: faker.internet.password(),
      createdAt: faker.date.past(),
      authStrategy: faker.helpers.arrayElement(['google', 'facebook', 'twitter']),
      updatedAt: faker.date.recent(),
      profile: new Profile(),
      role: new RoleEntity(),
      episodes: [ 
        new Episode(),
      ],
    },
  ];
  
  // Assign random roles
  users.forEach((user) => {
    user.role = new RoleEntity();
    user.role.role = faker.helpers.arrayElement(Object.values(Role));
    
   
    user.episodes.forEach((episode) => {
      episode.title = faker.lorem.sentence(); 
      episode.featured = faker.datatype.boolean(); 
    });
  });
  
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
      ) {}
    
  // async findUserByName(username : string) : Promise<User | undefined>{
  //     const user = users.find(user => user.username === username);
  //     if (user) {
  //         user.password = await bcrypt.hash(user.password, 10);
  //     }
  //     return user;
  // }
  
  findUserByName(username: string): User | undefined {
    return users.find((user) => user.username === username);
  }

  async findOneById(userId: number): Promise<User | undefined> {
    const user = users.find((user) => user.userId === userId);
    if (user) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return user;
  }
  

  async findAllUsers(filters: Record<string, any>): Promise<User[]> {
    const query: SelectQueryBuilder<User> = this.userRepository.createQueryBuilder('users');
  
    query.leftJoinAndSelect('users.profile', 'profile');
    query.leftJoinAndSelect('users.role', 'role');        // Join Role

    // Applying filters dynamically
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        // query.orWhere(`users.${key} = :${key}`, { [key]: filters[key] });
        query.andWhere(`users.${key} = :${key}`, { [key]: filters[key] });
      }
    });
    // Execute the query and return the result
    return query.getMany();
  }

  async createUser(userDetails: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const newUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  async updateUserById(id: number, updateUserDetails: UpdateUserDto) {
    try {
      if (updateUserDetails.password) {
        updateUserDetails.password = bcrypt.hashSync(updateUserDetails.password, 10);
      }
      const updateResult = await this.userRepository.update(id, { ...updateUserDetails });

      if (updateResult.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const updatedUser = await this.userRepository.findOne({ where: { userId: id } });

      return {
        success: true,
        message: 'User updated successfully',
        raw: updatedUser,
        affected: updateResult.affected,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Extract the duplicated value from the error message
        const match = error.sqlMessage.match(/Duplicate entry '(.*?)' for key/);
        const duplicatedValue = match ? match[1] : 'unknown_value';
    
         throw new DuplicateEntryException(duplicatedValue);
    }
    throw error; 
    }
  }


  async deleteUserById(id: number) {
    return await this.userRepository.delete(id);
  }

  async createUserProfiles(
    id: number,
    createProfileDetails: CreateProfileDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new HttpException('User not found, cannot create profile' ,HttpStatus.BAD_REQUEST);
    }
    let profile = user.profile; 
    if (!profile) {
      profile = this.profileRepository.create(createProfileDetails); 
      await this.profileRepository.save(profile); 
    }

    user.profile = profile; 
    await this.userRepository.save(user);

    return user;
  }

  async createUserEpisodes(
    id: number,
    createUseeEpisodesDetails: CreateEpisodeDto,
  ) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user)
      throw new HttpException(
        'User not found. Cannot create Episode',
        HttpStatus.BAD_REQUEST,
      );
    const newEpisode = this.episodeRepository.create({
      ...createUseeEpisodesDetails,
      user,
    });
    return this.episodeRepository.save(newEpisode);
  }

}
