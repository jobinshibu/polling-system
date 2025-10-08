import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Poll' }], default: [] })
  votedPolls: Types.ObjectId[];

  @Prop({ default: Date.now }) // Optional field
  createdAt: Date;

  _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);