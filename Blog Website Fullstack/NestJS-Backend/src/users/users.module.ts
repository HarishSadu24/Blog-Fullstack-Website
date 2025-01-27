import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {  UserSchema } from '../schemas/User.schema';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports : [
    MongooseModule.forFeature([
      {
        name: "user", 
        schema: UserSchema,
        collection:"user"
      },
      
    ]),
    HttpModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
