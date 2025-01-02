import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Setting extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, required: false })
  email: string;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({ type: String, required: false }) // OTP field to store the generated OTP
  otp: string;

  @Prop({ type: Date, required: false }) // OTP expiration time
  otpExpiresAt: Date;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
