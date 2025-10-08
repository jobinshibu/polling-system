import { IsInt, Min, IsOptional, IsString, IsArray, IsBoolean, IsNumber } from 'class-validator';

export class CreatePollDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  options: string[];

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsArray()
  allowedUsers?: string[];
}

export class UpdatePollDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsArray()
  allowedUsers?: string[];
}

export class VoteDto {
  @IsInt()
  @Min(0)
  optionIndex: number;
}

