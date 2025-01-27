import { CommentSchema } from './../schemas/Comment.schema';
import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from '../schemas/Blog.schema';
import { UserSchema } from '../schemas/User.schema';
import { HttpModule } from '@nestjs/axios';
import { MediaSchema } from 'src/schemas/Media.schema';

@Module({

  imports: [
    MongooseModule.forFeature([
      {
        name: "blog",
        schema: BlogSchema,
        collection: "blog"
      },
      {
        name: "user",
        schema: UserSchema,
        collection: "user"
      },
      {
        name: "comment",
        schema: CommentSchema,
        collection: "comment"
      },
      {
        name: "media",
        schema: MediaSchema,
        collection: "media"
      }
    ]),
    HttpModule],

  providers: [BlogsService],
  controllers: [BlogsController]
})

export class BlogsModule { }
