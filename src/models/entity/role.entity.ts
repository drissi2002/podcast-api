/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../enum/role.enum';

@Entity('users_roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER, // Default role
  })
  role: Role;
}
