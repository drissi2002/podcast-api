/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/entity/user.entity';
import { UsersController } from './users.controller';
import { RoleEntity } from 'src/models/entity/role.entity';
import { Profile } from 'src/models/entity/profile.entity';
import { Episode } from 'src/models/entity/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,RoleEntity,Profile,Episode])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
