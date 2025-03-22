/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { RoleEntity } from './role.entity';
import { Episode } from './episode.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  userId: number;

  @Column({ unique: true })
  username: string;
  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  authStrategy: string;

  @OneToOne(()=> Profile )
  @JoinColumn()
  profile : Profile;

  @ManyToOne(() => RoleEntity, (role) => role.roleId) // Many users can have the same role
  @JoinColumn({ name: 'roleId' }) // Foreign key column in the user table
  role: RoleEntity;

  @OneToMany(() => Episode, (episode) => episode.user) // One user can have many episodes
  episodes: Episode[]; // This defines the episodes related to this user

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date; // Auto-update timestamp

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
