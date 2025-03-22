/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsOptional, IsDate, IsEnum } from 'class-validator';

export class CreateProfileDto {
  @IsOptional() // Optional since it's generated automatically
  id?: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string; // Optional phone number

  @IsOptional()
  @IsDate()
  birthDate?: Date; // Optional birth date

  @IsEnum(['active', 'suspended', 'inactive']) // Example status values
  status: string; // Account status (e.g., active, suspended, etc.)
}
