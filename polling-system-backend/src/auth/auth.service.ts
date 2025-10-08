import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, email, password, role } = registerDto;
    const existingUser = await this.userModel.findOne({ $or: [{ email }, { username }] }).lean();
    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException('Email already in use');
      }
      if (existingUser.username === username) {
        throw new BadRequestException('Username already used');
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, email, password: hashedPassword, role, createdAt: new Date() });
    return user.save();
}

  async validateUser(loginDto: LoginDto): Promise<Partial<User> | undefined> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return undefined;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return undefined;
    }
    return { _id: user._id, email: user.email, role: user.role };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    if (!user) {
      // Generic error message for security - don't reveal if email exists or password is wrong
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user._id) throw new UnauthorizedException('Invalid email or password');
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Logout successful' };
  }

  async getProfile(userId: string): Promise<Partial<User> | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user ? user.toObject() : null;
  }

  async getVotedPolls(userId: string): Promise<any[]> { // Adjust return type based on schema
    const user = await this.userModel.findById(userId).populate('votedPolls').lean();
    if (!user) throw new NotFoundException('User not found');
    return user.votedPolls || [];
  }

  async updateProfile(userId: string, updateDto: { oldPassword?: string; password?: string }): Promise<Partial<User> | null> {
    // Require both old and new password
    if (!updateDto.oldPassword || !updateDto.password) {
      throw new BadRequestException('Old password and new password are required');
    }
    
    // Get user with password to verify
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(updateDto.oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    
    // Hash and update new password
    const hashedPassword = await bcrypt.hash(updateDto.password, 10);
    user.password = hashedPassword;
    await user.save();
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.userModel.findByIdAndDelete(userId);
  }

  async getAllUsers(): Promise<Partial<User>[]> {
    return this.userModel
      .find({ role: 'user' })
      .select('_id username email')
      .lean();
  }
}