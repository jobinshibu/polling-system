import { Controller, Post, Body, UseGuards, Get, Put, Delete, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Get('protected')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getProtected() {
    return { message: 'This is protected for admins only' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser('userId') userId: string) {
    const profile = await this.authService.getProfile(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  @Get('voted-polls')
  @UseGuards(AuthGuard('jwt'))
  async getVotedPolls(@GetUser('userId') userId: string) {
    return this.authService.getVotedPolls(userId);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@GetUser('userId') userId: string, @Body() updateDto: Partial<RegisterDto>) {
    return this.authService.updateProfile(userId, updateDto);
  }

  @Delete('profile')
  @UseGuards(AuthGuard('jwt'))
  async deleteProfile(@GetUser('userId') userId: string) {
    await this.authService.deleteProfile(userId);
    return { message: 'Profile deleted' };
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}