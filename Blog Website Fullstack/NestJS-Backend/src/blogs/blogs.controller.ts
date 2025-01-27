import {
	Controller,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	Get,
	Put,
	UseGuards,
	Req,
	UseInterceptors,
	Query,
	Res,
	UploadedFiles,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto, CommentDto, UpdateCommentDto, SubCommentDto } from './dtos/CreateBlog.dto';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';


@UseGuards(AuthGuard)
@Controller('blogs')
export class BlogsController {
	constructor(private readonly blogService: BlogsService) { }

	@Post('createblog')
	createBlog(@Req() req, @Body() createBlogDto: CreateBlogDto) {
		createBlogDto.userName = req.userName;
		return this.blogService.createBlog(createBlogDto);
	}

	@Get('getblog/:blog_id')
	getBlog(@Param('blog_id') blog_id: ObjectId) {
		return this.blogService.getBlog(blog_id);
	}

	@Patch('updateblog/:blog_id')
	updateBlog(@Req() req, @Param('blog_id') blog_id: ObjectId, @Body() updateBlogDto: UpdateBlogDto) {
		return this.blogService.updateBlog(req.userName, blog_id, updateBlogDto);
	}

	@Delete('deleteblog/:blog_id')
	deleteBlog(@Req() req, @Param('blog_id') blog_id: ObjectId) {
		return this.blogService.deleteBlog(req.userName, blog_id);
	}

	//loading the blogs lazily
	@Get('fetchblogs')
	async fetchBlogs(@Req() req, @Query('sortBy') sortBy: 'createdAt' | 'likes' = 'createdAt', @Query('page') page: number, @Query('limit') limit: number, @Query('filter') filter: string) {
		return this.blogService.fetchBlogs(req.userName, sortBy, page, limit, filter);
	}

	@Patch('like/:blog_id')
	addOrRemoveLike(@Req() req, @Param('blog_id') blog_id: ObjectId) {
		return this.blogService.addOrRemoveLike(req.userName, blog_id);
	}

	@Get('tags')
	getTags() {
		return this.blogService.getTags();
	}

	@Post('addcomment/:blog_id')
	async addComment(@Req() req, @Param('blog_id') blog_id: ObjectId, @Body() commentDto: CommentDto) {
		commentDto.userName = req.userName;
		return this.blogService.addComment(blog_id, commentDto);
	}

	@Get('comments/:blog_id')
	fetchComments(@Param('blog_id') blog_id: ObjectId, @Query('page') page: number, @Query('limit') limit: number) {
		return this.blogService.fetchComments(blog_id, page, limit);
	}

	@Patch('editcomment/:comment_id')
	editComment(@Req() req, @Param('comment_id') comment_id: ObjectId, @Body() updateCommentDto: UpdateCommentDto) {
		return this.blogService.editComment(req.userName, comment_id, updateCommentDto);
	}

	@Delete('deletecomment/:comment_id/:blog_id')
	deleteComment(@Req() req,@Param('comment_id') comment_id:ObjectId,@Param('blog_id') blog_id:ObjectId){
		return this.blogService.deleteComment(req.userName,comment_id,blog_id);
	}

	// @Post('uploadfile/:blog_id')
	// @UseInterceptors(
	// 	FileInterceptor(
	// 		'file',
	// 		{
	// 			storage: diskStorage({
	// 				destination: './uploads',
	// 				filename: (req, file, cb) => {
	// 					const name = file.originalname.split('.')[0];
	// 					const fileExtension = file.originalname.split('.')[1];
	// 					const newFileName = name.split(' ').join('_') + '_' + Date.now() +
	// 						'.' + fileExtension;
	// 					cb(null, newFileName);
	// 				}
	// 			})
	// 		}
	// 		//     fileFilter: (req,file,cb)=>{
	// 		//         if(!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4)$/)){
	// 		//             cb(null,false);
	// 		//         }
	// 		//         cb(null,true);
	// 		//     }
	// 		// })
	// 	)
	// )
	// async uploadFile(
	// 	@UploadedFile(
	// 		new ParseFilePipeBuilder()
	// 			.addFileTypeValidator({
	// 				fileType: /(jpg|jpeg|png|gif|mp4)$/
	// 			})
	// 			.addMaxSizeValidator({
	// 				maxSize: 10 * 1024 * 1024
	// 			})
	// 			.build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
	// 	)
	// 	file: Express.Multer.File,
	// 	@Param('blog_id') blog_id: ObjectId,
	// 	@Req() req
	// ) {
	// 	// const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
	// 	const updatedBlog = await this.blogService.uploadFile(file, blog_id, req.userName);
	// 	return updatedBlog;
	// }

	@Post('uploadfiles/:blog_id')
	@UseInterceptors(FilesInterceptor('files', 10, {
		limits: {
			fileSize: 10 * 1024 * 1024,
		},
	} as MulterOptions))
	async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Param('blog_id') blog_id:ObjectId) {
		return this.blogService.uploadFiles(files,blog_id);
		// res.setHeader('Content-Type', bufferedImage.mimetype);
		// res.send(bufferedImage.buffer);
	}

	@Post('replycomment/:comment_id')
	addSubComment(
		@Req() req,
		@Param('comment_id') comment_id: ObjectId,
		@Body() subCommentDto: SubCommentDto
	) {
		subCommentDto.userName = req.userName;
		return this.blogService.addSubComment(comment_id, subCommentDto);
	}

	@Put('addtag/:blog_id')
	addTag(@Param('blog_id') blog_id: ObjectId, @Body() tag: string, @Req() req) {
		return this.blogService.addTag(tag, req.userName, blog_id);
	}

	@Patch('removeblog/:blog_id')
	removeBlog(@Req() req, @Param('blog_id') blog_id: ObjectId, @Body('isRemoved') isRemoved: boolean) {
		return this.blogService.removeBlog(req.userName, blog_id, isRemoved)
	}

	@Get('replies/:comment_id')
	getReplies(@Param('comment_id') comment_id: ObjectId, @Query('page') page: number, @Query('limit') limit: number) {
		return this.blogService.fetchReplies(comment_id, page, limit);
	}

	@Patch('likecomment/:comment_id')
	likeComment(@Req() req, @Param('comment_id') comment_id: ObjectId) {
		return this.blogService.likeComment(req.userName, comment_id);
	}


}
