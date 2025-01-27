import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../schemas/User.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../users/dtos/User.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(@InjectModel('user') private userModel: Model<UserModel>,
        private jwtService: JwtService,
    ) { };
    async signUp(signUpDto: CreateUserDto) {
        const { userName, ...singUpDto } = signUpDto;
        const userNameInUse = await this.userModel.findOne({ userName });
        if (userNameInUse) {
            throw new BadRequestException('User already in use');
        }
        const newUser = await new this.userModel({ userName, ...signUpDto });
        const { password, ...savedUser } = await newUser.save();
        return savedUser;
    }

    async signIn(credentials: LoginDto) {
        const { userName, password } = credentials;
        const user = await this.userModel.findOne({ userName });
        if (!user || password !== user.password) {
            throw new UnauthorizedException('Wrong Credentials');
        }
        const tokens = await this.generateUserTokens(userName);
        return {
            ...tokens,
            userName,
        }
    }

    async refreshTokens(refreshToken: string) {
        // const token = await this.refreshTokenModel.findOneAndDelete({ //deleting the previous one and creating the new refresh token
        //     token: refreshToken,
        //     expiryDate: { $gte: new Date() },
        // });

        try {
            const token = this.jwtService.verify(refreshToken);
            return this.generateUserTokens(token.userName);
        }
        catch (e) {
            throw new UnauthorizedException("Refresh Token is Invalid");
        }

        // if (!token) {
        //     throw new UnauthorizedException("Refresh Token is Invalid");
        // }

    }

    async generateUserTokens(userName: string) {
        const accessToken = this.jwtService.sign({ userName }, { expiresIn: '5h' });
        // const refreshToken = uuidv4();
        // //storing refresh Token
        // await this.storeRefreshToken(refreshToken, userName);
        const refreshToken = this.jwtService.sign({ userName }, { expiresIn: '3d' });
        return {
            accessToken,
            refreshToken,
            userName
        }
    }

    // async storeRefreshToken(token: string, userName: string) {

    //     const expiryDate = new Date();
    //     expiryDate.setDate(expiryDate.getDate() + 3);
    //     // await this.refreshTokenModel.create({token,userName,expiryDate});
    //     await this.refreshTokenModel.updateOne(
    //         { userName },
    //         { $set: { token, expiryDate } },
    //         { upsert: true } //upsert is if doesn't exist creates new one
    //     );
    // }
}
