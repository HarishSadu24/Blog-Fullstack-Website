import { Schema , Prop , SchemaFactory } from "@nestjs/mongoose";
import { BlogModel } from './Blog.schema';
import mongoose from "mongoose";

@Schema()
export class UserModel{

    @Prop({required:true,unique:true})
    userName:string;

    @Prop({ required:true })
    displayName:string;

    @Prop({ required:true })
    password:string;

    @Prop({required:false})
    email?:string;

    @Prop({type:[{type: mongoose.Schema.Types.ObjectId  , ref: 'BlogModel'}]})
    blogs?: BlogModel[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel); 