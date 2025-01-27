import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/User.dto';
import { AuthService } from './auth.service';
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from './dto/refresh-tokens.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){};

    @Post('signup')
    async signUp(@Body() signUpDto : CreateUserDto){
        return this.authService.signUp(signUpDto);
    }

    @Post('signin')
    async signIn(@Body() credentials: LoginDto){
        return this.authService.signIn(credentials);
    }

    @Post('refresh')
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto){
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }

}
