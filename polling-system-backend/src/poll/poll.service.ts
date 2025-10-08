import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Poll, PollDocument } from '../auth/poll.schema';
import { User, UserDocument } from '../auth/users.schema';
import { Types } from 'mongoose';

@Injectable()
export class PollService {
  constructor(
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async canUserAccessPoll(poll: Poll, userId?: string, userEmail?: string): Promise<boolean> {
    // Public polls are accessible to everyone
    if (!poll.isPrivate) return true;
    
    // Check if user is admin - admins can access ALL polls
    if (userId) {
      const user = await this.userModel.findById(userId).select('role username').lean();
      if (user?.role && user.role.toLowerCase() === 'admin') {
        return true;
      }
      
      // Check by username in allowedUsers
      if (user && poll.allowedUsers.includes(user.username)) {
        return true;
      }
    }
    
    // Check if userId or userEmail is in allowedUsers
    if (poll.allowedUsers.some(allowed => allowed === userId || allowed === userEmail)) {
      return true;
    }
    
    return false;
  }

  async createPoll(userId: string, title: string, options: string[], durationMinutes?: number, expiresAt?: string, isPrivate?: boolean, allowedUsers?: string[]): Promise<Poll> {
    if (!title || !title.trim()) throw new BadRequestException('Title is required');
    if (!options || options.length < 2) throw new BadRequestException('At least 2 options are required');
    const duration = durationMinutes || 60;
    if (duration < 1 || duration > 120) throw new BadRequestException('Duration must be between 1 and 120 minutes');

    const newPoll = new this.pollModel({
      title: title.trim(),
      options: options.map(text => ({ text: text.trim() || '', votes: 0 })),
      createdBy: userId,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + duration * 60 * 1000),
      durationMinutes: duration,
      isPrivate: isPrivate || false,
      allowedUsers: allowedUsers || [],
    });
    return newPoll.save();
  }

  async vote(userId: string, pollId: string, optionIndex: number, userEmail?: string): Promise<Poll> {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new NotFoundException('Poll not found');
    
    // Check if user is admin - admins cannot vote
    const user = await this.userModel.findById(userId).select('role').lean();
    if (user?.role && user.role.toLowerCase() === 'admin') {
      throw new BadRequestException('Admins cannot vote. You can only view results');
    }
    
    // Check private poll access
    if (!(await this.canUserAccessPoll(poll, userId, userEmail))) {
      throw new BadRequestException('You do not have access to this private poll');
    }
    
    // Check if poll has expired
    if (poll.expiresAt && new Date() > poll.expiresAt) {
      throw new BadRequestException('This poll has expired. Voting is no longer allowed');
    }
    
    const userObjectId = new Types.ObjectId(userId);
    
    // Check duplicate vote
    if (poll.votes.some(vote => vote.equals(userObjectId))) {
      throw new BadRequestException('You have already voted on this poll');
    }
    
    // Validate option index
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      throw new BadRequestException('Invalid option selected');
    }
    
    // Update poll
    poll.votes.push(userObjectId);
    poll.options[optionIndex].votes += 1;
    
    // Update user's votedPolls array
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { votedPolls: new Types.ObjectId(pollId) }
    });
    
    return poll.save();
  }

  async getPoll(pollId: string, userId?: string, userEmail?: string): Promise<Poll> {
    const poll = await this.pollModel.findById(pollId).populate('createdBy', 'username');
    if (!poll) throw new NotFoundException('Poll not found');
    
    // Check private poll access
    if (!(await this.canUserAccessPoll(poll, userId, userEmail))) {
      throw new BadRequestException('You do not have access to this private poll');
    }
    
    return poll;
  }

  async getPollResults(pollId: string): Promise<{ options: string[]; votes: number[]; percentages: number[] }> {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new NotFoundException('Poll not found');
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    const voteCounts = poll.options.map(option => option.votes);
    const percentages = totalVotes > 0 ? voteCounts.map(votes => Math.round((votes / totalVotes) * 100)) : voteCounts.map(() => 0);
    return { options: poll.options.map(o => o.text), votes: voteCounts, percentages };
  }

  async listPolls(userId?: string, userEmail?: string): Promise<Poll[]> {
    // If no user info provided, return only public polls
    if (!userId) {
      return this.pollModel
        .find({ isPrivate: false })
        .sort({ _id: -1 })
        .populate('createdBy', 'username')
        .lean();
    }

    // Get user's username and role
    const user = await this.userModel.findById(userId).select('username role').lean();
    const username = user?.username;
    const role = user?.role;

    // Convert userId to ObjectId for comparison with createdBy
    const userObjectId = new Types.ObjectId(userId);

    // Build allowed values array
    const allowedValues = [userId, userEmail];
    if (username) allowedValues.push(username);

    // If user is admin, show ALL polls (public and private)
    if (role && role.toLowerCase() === 'admin') {
      return this.pollModel
        .find()
        .sort({ _id: -1 })
        .populate('createdBy', 'username')
        .lean();
    }

    // For regular users:
    // 1. All public polls
    // 2. Private polls where user is in allowedUsers
    return this.pollModel
      .find({
        $or: [
          { isPrivate: false },
          { isPrivate: true, allowedUsers: { $in: allowedValues } }
        ]
      })
      .sort({ _id: -1 })
      .populate('createdBy', 'username')
      .lean();
  }

  async deletePoll(pollId: string): Promise<void> {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new NotFoundException('Poll not found');
    await this.pollModel.findByIdAndDelete(pollId);
  }

  async updatePoll(pollId: string, updateDto: { title?: string; options?: string[]; durationMinutes?: number; isPrivate?: boolean; allowedUsers?: string[] }): Promise<Poll> {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new NotFoundException('Poll not found');
    
    if (poll.expiresAt && new Date() > poll.expiresAt) {
      throw new BadRequestException('Cannot edit an expired poll');
    }
    
    if (updateDto.title !== undefined) {
      if (!updateDto.title || !updateDto.title.trim()) throw new BadRequestException('Title is required');
      poll.title = updateDto.title.trim();
    }
    
    if (updateDto.options !== undefined) {
      if (!updateDto.options || updateDto.options.length < 2) throw new BadRequestException('At least 2 options are required');
      poll.options = updateDto.options.map(newOptText => {
        const text = String(newOptText || '').trim();
        const existingOpt = poll.options.find(o => o.text === text);
        return { text, votes: existingOpt?.votes || 0 };
      });
    }
    
    if (updateDto.durationMinutes !== undefined) {
      const duration = updateDto.durationMinutes || 60;
      if (duration < 1 || duration > 120) throw new BadRequestException('Duration must be between 1 and 120 minutes');
      poll.durationMinutes = duration;
      poll.expiresAt = new Date(Date.now() + duration * 60 * 1000);
    }
    
    if (updateDto.isPrivate !== undefined) {
      poll.isPrivate = updateDto.isPrivate;
    }
    
    if (updateDto.allowedUsers !== undefined) {
      poll.allowedUsers = updateDto.allowedUsers;
    }
    
    await poll.save();
    return poll;
  }
}