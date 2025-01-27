import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs/blogs.module';
import { AuthModule } from './auth/auth.module';
import config from "./config/config";
import { ConfigModule,ConfigService } from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [UsersModule,
  ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    load: [config],
  }),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async(config)=>({
      secret:config.get('jwt.secret'),
    }),
    global:true,
    inject:[ConfigService],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async(config)=>({
      uri: config.get('database.connectionString'),
    }),
    inject:[ConfigService],
  }),
  BlogsModule,
  AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 