import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { Poll, PollSchema } from '../auth/poll.schema';
import { User, UserSchema } from '../auth/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Poll.name, schema: PollSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}