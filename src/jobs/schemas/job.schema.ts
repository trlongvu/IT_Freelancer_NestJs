import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Array, required: true })
  skills: string[];

  @Prop({ type: Object, required: true })
  company: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: Number, required: true })
  salary: number;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: String })
  level: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
