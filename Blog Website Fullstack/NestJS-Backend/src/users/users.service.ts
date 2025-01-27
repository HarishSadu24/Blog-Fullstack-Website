import { Injectable , HttpException } from '@nestjs/common';
import { UserModel } from '../schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { CreateUserDto , UpdateUserDto} from './dtos/User.dto';
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel("user") private readonly userModel: Model<UserModel>,
    private httpService: HttpService){};

    async signUp(createUserDto: CreateUserDto){
        try{
        // const newUser = await new this.userModel(createUserDto);
        // return newUser.save();
        const url = "http://192.168.2.107:3000/auth/signup";
        const response = await lastValueFrom(
            this.httpService.post(url,createUserDto),
        );
        return response.data;
        }
        catch(e){
            return e;
        }
    }

    async signIn(loginDto: LoginDto){
        try{

        const url = "http://192.168.2.107:3000/auth/signin";
        const response = await lastValueFrom(
            this.httpService.post(url,loginDto),
        );
        return response.data;
        }
        catch(e){
             return 'Invalid Credentials';
         }
    }

    async fetchUserDetails(userName:string){
        try{

        const userDetails = await this.userModel.findOne({userName});
        return userDetails;
        }
        catch(e){
             return e;
         }
    }
    // async getUsers(){
    //     try{
    //     return await this.userModel.find().populate('blogs');
    //     }
    //     catch(e){
    //         return e;
    //     }
    // }

    

    async updateUser(userName:string ,updateUserDto: UpdateUserDto){
        try{
            const updatedUser = await this.userModel.findOneAndUpdate({userName},updateUserDto,{new:true,runValidators:true});
            if(!updatedUser) throw new HttpException('User not found',404);
            return updatedUser;
        }
        catch(e){
            return e;
        }
    }

    // async deleteUser(userName: string){
    //     try{
    //         const user = await this.userModel.findOneAndDelete({userName});
    //         if(!user) throw new HttpException('User not found',404);
    //         return user;
    //     }
    //     catch(e){
    //         return e.message;
    //     }
    // }
}
 