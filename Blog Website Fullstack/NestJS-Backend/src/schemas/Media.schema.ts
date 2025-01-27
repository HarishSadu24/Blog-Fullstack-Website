import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class MediaModel {

    @Prop({ type: String })
    filename: string;

    @Prop()
    mimetype: string;

    @Prop({ type: Buffer })
    buffer: Buffer;

    @Prop()
    buffer_string: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'blog' })
    blog_id: ObjectId;

}

export const MediaSchema = SchemaFactory.createForClass(MediaModel);