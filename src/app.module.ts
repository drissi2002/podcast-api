/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EpisodesModule } from './episodes/episodes.module';
import { TopicsModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportAuthController } from './auth/passport-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/entity/user.entity';
import { Profile } from './models/entity/profile.entity';
import { RoleEntity } from './models/entity/role.entity';
import { Episode } from './models/entity/episode.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'podcast',
      entities: [User,RoleEntity,Profile,Episode],
      synchronize: true,
    }),
    EpisodesModule,
    TopicsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, PassportAuthController],
  providers: [AppService],
})
export class AppModule {}
