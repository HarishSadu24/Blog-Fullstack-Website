import { IsString, IsNotEmpty, MaxLength, IsOptional ,IsNumber ,IsArray , IsBoolean, IsEmpty} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateBlogDto{

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title:string;

    @IsNotEmpty()
    @IsArray()
    content: {
        type:string;
        content:string;
    }[];
 
    @IsOptional()
    @IsNumber()
    likes?:number;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    likedUsers?:string[];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userId:string;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    tags?:string[];

    @IsOptional()
    @IsArray()
    media?:Express.Multer.File[] | any;

}

export class UpdateBlogDto {

    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?:string;

    @IsOptional()
    @IsArray()
    content: {
        type:string;
        content:string;
    }[];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userId:string;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    tags?:string[];

    @IsOptional()
    @IsNumber()
    likes?:number;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    likedUsers?:string[];

    @IsOptional()
    @IsBoolean()
    isRemoved?:boolean;

    @IsOptional()
    @IsArray()
    media?:Express.Multer.File[] | any;
}

export class CommentDto {
    @IsOptional()
    @IsString()
    userName?:string;

    @IsNotEmpty()
    @IsString()
    comment:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    blog_id:string;


}

export class UpdateCommentDto {

    @IsNotEmpty()
    @IsString()
    comment:string;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    likedUsers:string[];
}

export class SubCommentDto {
    @IsOptional()
    @IsString()
    userName?: string;

    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsOptional()
    parentComment:ObjectId;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    blog_id:string;

}
