import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class LoginDto {

    @IsString()
    @IsNotEmpty()
    userName:string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
