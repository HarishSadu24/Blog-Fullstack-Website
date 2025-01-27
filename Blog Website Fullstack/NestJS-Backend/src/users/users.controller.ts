import { AuthGuard } from './../guards/auth.guard';
import { Controller, Body, Post, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/User.dto';
import { UsersService } from './users.service';
import { LoginDto } from '../auth/dto/login.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService){};

    @Post('signup')
    signUp(@Body() createUserDto: CreateUserDto){
        return this.userService.signUp(createUserDto);
    }

    @Post('signin')
    SignIn(@Body() loginDto: LoginDto){
        return this.userService.signIn(loginDto);
    }

    // @Get()
    // getUsers(){
    //     return this.userService.getUsers();
    // }

    // @Get(':userName')
    // getUserByUserName(@Param('userName') userName:string){
    //     return this.userService.getUserByUserName(userName);
    // }

    @UseGuards(AuthGuard)
    @Patch('updateuser')
    updateUser(@Req() req,@Body() updateUserDto: UpdateUserDto){
        return this.userService.updateUser(req.userName,updateUserDto);
    }

    // @Delete(':userName')
    // deleteUser(@Param('userName') userName:string){
    //     return this.userService.deleteUser(userName);
    // }

    @UseGuards(AuthGuard)
    @Get('fetchuserdetails')
    fetchUserDetails(@Req() req){
        return this.userService.fetchUserDetails(req.userName);
    }
}
