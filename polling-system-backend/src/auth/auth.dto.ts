import { IsEmail, IsString, MinLength, MaxLength, Matches, IsIn, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username cannot be longer than 20 characters' })
  @Matches(/^\S+$/, { message: 'Username cannot contain spaces' })
  username: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password cannot be longer than 50 characters' })
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'], { message: 'Role must be either admin or user' })
  role?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  password: string;
}