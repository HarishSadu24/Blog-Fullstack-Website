import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';

@Schema({timestamps:true})
export class CommentModel {

    @Prop({required: true})
    userName:string;

    @Prop({required:true})
    comment:string;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId , ref: 'comment'}] , default:[]})
    replies : CommentModel[];

    @Prop()
    likedUsers:string[];

    @Prop({default:null})
    parentComment:Types.ObjectId;

    @Prop({required:true})
    blog_id:Types.ObjectId;

}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);