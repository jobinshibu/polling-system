import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type PollDocument = Poll & Document;

@Schema({ timestamps: true })
export class Poll {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({
    required: true,
    type: [{ text: String, votes: { type: Number, default: 0 } }],
    validate: {
      validator: (v) => v && v.length >= 2,
      message: 'At least 2 options are required',
    },
  })
  options: { text: string; votes: number }[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  votes: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Date })
  expiresAt: Date;

  @Prop({
    type: Number,
    default: 60,
    min: 1,
    max: 120,
  })
  durationMinutes: number;

  @Prop({ type: Boolean, default: false })
  isPrivate: boolean;

  @Prop({ type: [String], default: [] })
  allowedUsers: string[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);