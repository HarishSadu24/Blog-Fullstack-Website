import { IsNotEmpty,IsString,IsOptional } from "class-validator";

export class CreateUserDto{

    @IsNotEmpty()
    @IsString()
    userName:string;

    @IsNotEmpty()
    @IsString()
    displayName:string;

    @IsNotEmpty()
    @IsString()
    password:string;

    @IsOptional()
    @IsString()
    email:string;
}

export class UpdateUserDto{
    @IsOptional()
    @IsString()
    displayName?:string;

    @IsOptional()
    @IsString()
    password?:string;

    @IsOptional()
    @IsString()
    email?:string;
}