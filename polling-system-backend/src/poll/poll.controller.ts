import { Controller, Post, Body, Param, Put, Get, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { PollService } from './poll.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreatePollDto, UpdatePollDto, VoteDto } from './poll.dto';

@Controller('poll')
export class PollController {
  constructor(private pollService: PollService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async createPoll(@GetUser('userId') userId: string, @Body() body: CreatePollDto) {
    return this.pollService.createPoll(userId, body.title, body.options, body.durationMinutes, undefined, body.isPrivate, body.allowedUsers);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listPolls(@GetUser('userId') userId: string, @GetUser('email') userEmail: string) {
    return this.pollService.listPolls(userId, userEmail);
  }

  @Get(':id/results')
  async getPollResults(@Param('id') pollId: string) {
    const results = await this.pollService.getPollResults(pollId);
    if (!results) throw new NotFoundException('Poll results not available');
    return results;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getPoll(@Param('id') pollId: string, @GetUser('userId') userId: string, @GetUser('email') userEmail: string) {
    const poll = await this.pollService.getPoll(pollId, userId, userEmail);
    if (!poll) throw new NotFoundException('Poll not found');
    return poll;
  }

  @Put(':id/vote')
  @UseGuards(AuthGuard('jwt'))
  async vote(@GetUser('userId') userId: string, @GetUser('email') userEmail: string, @Param('id') pollId: string, @Body() voteDto: VoteDto) {
    return this.pollService.vote(userId, pollId, voteDto.optionIndex, userEmail);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async deletePoll(@Param('id') pollId: string) {
    await this.pollService.deletePoll(pollId);
    return { message: 'Poll deleted' };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async updatePoll(@Param('id') pollId: string, @Body() updateDto: UpdatePollDto) {
    return this.pollService.updatePoll(pollId, updateDto);
  }
}