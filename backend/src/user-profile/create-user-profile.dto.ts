
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateUserProfileDto{

    @IsString()
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    @IsString()
    phoneNumber:string

    @IsDateString()
    @IsNotEmpty()
    dateOfBirth:string

    @IsString()
    @IsNotEmpty()
    gender:string

    @IsString()
    @IsNotEmpty()
    address:string

    @IsString()
    @IsNotEmpty()
    occupation:string

    @IsString()
    @IsNotEmpty()
    emergencyContact:string

}