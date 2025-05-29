import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubcriberDocument = HydratedDocument<Subcriber>;

@Schema({ timestamps: true })
export class Subcriber {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: Array, required: true })
  skills: string[];

  @Prop({ type: Object })
  createdBy: {
    _id: string;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: string;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: string;
    email: string;
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const SubcriberSchema = SchemaFactory.createForClass(Subcriber);
