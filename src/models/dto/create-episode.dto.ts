import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  userId: number;

  @IsDate()
  @Type(() => Date)
  publishedAt: Date;
}
