import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available globally
      envFilePath: '.env', // Specifies the .env file location
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string), // Type assertion to force string
    AuthModule,
    PollModule,
  ],
})
export class AppModule {}