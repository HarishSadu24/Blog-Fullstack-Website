import { Types, ObjectId } from 'mongoose';
import { CommentModel } from './Comment.schema';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserModel } from './User.schema';
import { MediaModel } from './Media.schema';


@Schema({timestamps:true})
export class BlogModel{
    @Prop({required: true,unique: true})
    title: string;

    @Prop({required: true})
    content: {
        type:string;
        content:string;
    }[];

    @Prop({required: false,default: 0})
    likes?: number;

    @Prop({required: false})
    likedUsers?: string[];

    @Prop({required: false})
    userName:string;

    @Prop({ type:mongoose.Schema.Types.ObjectId , ref : 'user' , required: true})
    userId:UserModel;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId , ref: 'comment'}]})
    comments:CommentModel[];

    // @Prop({required: false})
    // media?:Express.Multer.File[];

    @Prop({required: false})
    tags?:string[];

    @Prop({required:false,default:false})
    isRemoved?:boolean;

    @Prop({ type:[{type:mongoose.Schema.Types.ObjectId , ref:'media'}]})
    media? : MediaModel[];
}

export const BlogSchema = SchemaFactory.createForClass(BlogModel);