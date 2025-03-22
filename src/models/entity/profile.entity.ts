/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users_profiles')
export class Profile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string; // Unique email for profile

  @Column({ nullable: true })
  phoneNumber?: string; // Optional phone number

  @Column({ type: 'date', nullable: true })
  birthDate?: Date; // Optional birth date

  @Column({ default: 'active' })
  status: string; // Account status (e.g., active, suspended, etc.)

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date; // Auto-update timestamp
}
