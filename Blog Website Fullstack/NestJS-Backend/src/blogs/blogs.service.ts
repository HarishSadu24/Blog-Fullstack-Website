import { CommentModel } from './../schemas/Comment.schema';
import { ObjectId } from 'mongoose';
import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../schemas/Blog.schema';
import { CommentDto, UpdateCommentDto, SubCommentDto } from './dtos/CreateBlog.dto';
import { UserModel } from '../schemas/User.schema';
import { MediaModel } from 'src/schemas/Media.schema';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class BlogsService {

    constructor(
        @InjectModel("blog") private readonly blogModel: Model<BlogModel>,
        @InjectModel("user") private readonly userModel: Model<UserModel>,
        @InjectModel("comment") private readonly commentModel: Model<CommentModel>,
        @InjectModel("media") private readonly mediaModel: Model<MediaModel>,
        private httpService: HttpService
    ) { };

    async createBlog({ userName, media, ...createBlogDto }: any) {
        try {

            const user = await this.userModel.findOne({ userName });
            if (!user) throw new HttpException('User Not Found', 404);
            const blog = new this.blogModel({ ...createBlogDto, userName, userId: user._id });
            const updatedBlog = await blog.save();
            await user.updateOne({
                $push: {
                    blogs: updatedBlog._id,
                }
            });

            if (JSON.stringify(media[0]) !== '{}' && media.length >= 1) {
                const url = `http://192.168.2.107:3000/blogs/uploadfiles/${updatedBlog._id}`;
                const response = await lastValueFrom(
                    this.httpService.post(url, media)
                );
            }
            return updatedBlog;
        }

        catch (e) {
            // return new HttpException('cannot create blog',HttpStatus.NOT_ACCEPTABLE)
            return e.message;
        }
    }

    async updateBlog(userName: string, blog_id: ObjectId, { media, ...updateBlogDto }: any) {
        try {
            const updatedBlog = await this.blogModel.findOneAndUpdate({ userName, _id: blog_id }, updateBlogDto, { new: true, runValidators: true });
            if (!updatedBlog) throw new HttpException('blog not found', 402);
            return updatedBlog;
        }

        catch (e) {
            return e;
        }
    }

    async deleteBlog(userName: string, blog_id: ObjectId) {
        try {
            const blog = await this.blogModel.findOneAndDelete({ _id: blog_id }, { userName }).populate('comments');
            const user = await this.userModel.findOne({ userName });
            user.blogs.splice(user.blogs.indexOf(blog), 1);
            await user.save();
            if(blog.comments){
                await this.commentModel.deleteMany({blog_id});
            }
            return `deleted Blog : ${blog}`;
        }
        catch (e) {
            return e.message;
        }

    }

    async uploadFiles(files: Express.Multer.File[], blog_id: ObjectId) {
        const blog = await this.blogModel.findById(blog_id)
        const uploadFile = files.map(async file => {
            const { originalname, mimetype, buffer } = file;
            const media = new this.mediaModel({
                filename: originalname,
                mimetype: mimetype,
                buffer: buffer,
                buffer_string: buffer.toString('base64'),
                blog_id
            });
            let updatedMedia = await media.save();
            await blog.updateOne({
                $push: {
                    media: updatedMedia._id,
                }
            });
            return updatedMedia;

        });
        return await Promise.all(uploadFile);
    }

    async fetchBlogs(userName: string, sortBy: 'createdAt' | 'likes' = 'createdAt', page: number = 1, limit: number = 4, filter: string = 'all') {
        try {
            const query: any = {};
            if (filter === 'user' && userName) {
                query.userName = userName;
                query.isRemoved = false;
            }

            else if (filter === 'removed') {
                query.userName = userName;
                query.isRemoved = true;
            }

            else {
                query.isRemoved = false;
            }

            const skip = (page - 1) * limit;
            const blogs = await this.blogModel.find(query)
                .populate('comments')
                .sort({ [sortBy]: -1 })
                .skip(skip)
                .limit(limit).exec();
            return blogs;
        }

        catch (e) {
            return e;
        }
    }

    async getBlog(blog_id: ObjectId) {
        try {
            const blog = await this.blogModel.findOne({ _id: blog_id }).populate('media');
            if (!blog) throw new HttpException('blog not found', 402);
            return blog;
        }
        catch (e) {
            return e;
        }
    }

    async addOrRemoveLike(userName: string, blog_id: ObjectId) {
        try {
            const blog = await this.blogModel.findOne({ _id: blog_id });
            if (!blog) throw new HttpException('blog not found', 402);
            if (blog.likedUsers.includes(userName)) {
                blog.likes--;
                blog.likedUsers.splice(blog.likedUsers.indexOf(userName), 1);
                await blog.save();
                return blog;
            }
            else {
                blog.likes++;
                blog.likedUsers.push(userName);
                await blog.save();
                return blog;
            }
        }

        catch (e) {
            return e;
        }
    }

    async getTags() {
        try {
            const predefinedTags = ['Javascript', 'Typescripts', 'Python'];
            const allTags = await this.blogModel.find().select('tags -_id').exec();
            const uniqueTags = [...new Set([...allTags.map(i => i.tags).flat(), ...predefinedTags])];
            return uniqueTags;
        }
        catch (e) {
            return e;
        }

    }



    // async bufferImage(file:Express.Multer.File){
    //     console.log(file);      
    //     return {
    //         filename:file.originalname,
    //         mimetype:file.mimetype,
    //         size:file.size,
    //         buffer:file.buffer
    //     }
    // }

    async addComment(blog_id: ObjectId, commentDto: CommentDto) {
        try {
            const blog = await this.blogModel.findOne({ _id: blog_id });
            if (!blog) throw new HttpException('blog not found', 402);
            const comment = await new this.commentModel(commentDto);
            const updatedComment = await comment.save();
            if (!comment) throw new HttpException('comment was not provided', 402);
            // await blog.updateOne({
            //     $push :{
            //         comments : updatedComment._id,
            //     }
            // }).exec();
            await blog.comments.push(updatedComment);
            await blog.save();
            // updatedBlog = await blog.populate('comments');
            // const allComments = await this.blogModel.findById(blog_id).select('comments').populate({ path: 'comments', options: { sort: -1 } });        
            return updatedComment;
        }

        catch (e) {
            return e;
        }
    }

    async deleteComment(userName: string, comment_id: ObjectId , blog_id: ObjectId = null) {
        const comment = await this.commentModel.findOneAndDelete({ _id: comment_id, userName });
        if (!!comment ) {
            if(!comment.parentComment){
                if(blog_id){
                    await this.blogModel.findByIdAndUpdate(blog_id, {
                        $pull: {
                            comments: comment._id,
                        }
                    });
                }
            }
            else{
                await this.commentModel.findByIdAndUpdate(comment.parentComment , {
                    $pull: {
                        replies: comment._id,
                    }
                })
            }
            await this.deleteSubComments(comment);
        }
    }

    async deleteSubComments(comment:any){
        if(comment.replies){
            for(let reply of comment.replies){
                const subComment = await this.commentModel.findByIdAndDelete(reply._id);
                this.deleteSubComments(subComment);
            }
        }
    }

    async fetchComments(blog_id: ObjectId, page: number = 1, limit: number = 4) {
        try {
            const skip = (page - 1) * limit;
            const comments = await this.blogModel.findById(blog_id).select('comments').populate({ path: 'comments', options: { sort: { createdAt: -1 }, skip: skip, limit: limit } });
            return comments;
        }
        catch (e) {
            return e;
        }
    }

    async editComment(userName: string, comment_id: ObjectId, updateCommentDto: UpdateCommentDto) {
        try {
            let comment = await this.commentModel.findOneAndUpdate({ _id: comment_id, userName }, updateCommentDto, { new: true });
            if (!comment) throw new HttpException('comment not found', HttpStatus.NOT_FOUND);
            return comment;
        }

        catch (e) {
            return e;
        }
    }

    // async uploadFile(file: Express.Multer.File, blog_id: ObjectId, userName: string) {
    //     const blog = await this.blogModel.findOne({ _id: blog_id, userName });
    //     if (!blog) throw new HttpException('blog is not found', 402);
    //     // blog.media.push(fileUrl);
    //     // const file = await blog.save();
    //     // return file;
    //     blog.media.push(file);
    //     return blog.save();
    // }

    async addSubComment(comment_id: ObjectId, subCommentDto: SubCommentDto) {
        let comment = await this.commentModel.findOne({ _id: comment_id });
        if (!comment) throw new HttpException('subcomment not found', HttpStatus.NOT_FOUND);
        if (!!comment)
            subCommentDto.parentComment = comment_id;
        const subComment = await new this.commentModel(subCommentDto);
        const savedSubComment = await subComment.save();
        await comment.updateOne({
            $push: {
                replies: savedSubComment._id
            }
        });
        // return await this.blogModel.find().populate({
        //     path:'comments',
        //     populate:'replies'
        // });
        return savedSubComment;
    }

    async fetchReplies(comment_id: ObjectId, page: number = 1, limit: number = 4) {
        try {
            const skip = (page - 1) * limit;
            let replies = await this.commentModel.findById(comment_id).select('replies').populate({ path: 'replies', options: { sort: { createdAt: -1 }, skip: skip, limit: limit } });
            if (!replies) throw new HttpException('comment not found', HttpStatus.NOT_FOUND)
            return replies.replies;

        }
        catch (e) {
            return e;
        }
    }

    async addTag(tag: string, userName: string, blog_id: ObjectId) {
        const blog = await this.blogModel.findOne({ _id: blog_id, userName });
        if (!blog) throw new HttpException('blog was not found ', 402);
        await blog.updateOne({
            $push: {
                tags: tag
            }
        })
        return blog;
    }

    async removeBlog(userName: string, blog_id: ObjectId, newIsRemoved: boolean) {
        const blog = await this.blogModel.findOneAndUpdate({ _id: blog_id, userName }, {
            $set: {
                isRemoved: newIsRemoved
            }
        }, { new: true });

        if (!blog) throw new HttpException('blog not found', 402);
        return blog;
    }

    async likeComment(userName: string, comment_id: ObjectId) {
        try {

            let comment = await this.commentModel.findById(comment_id);
            if (!comment) throw new HttpException('subcomment not found', HttpStatus.NOT_FOUND);

            if (comment.likedUsers.includes(userName)) {
                const index = comment.likedUsers.indexOf(userName);
                comment.likedUsers.splice(index, 1);
            }
            else {
                comment.likedUsers.push(userName);
            }

            const savedComment = await comment.save();
            return savedComment.likedUsers;
        }
        catch (e) {
            return e;
        }
    }

}
