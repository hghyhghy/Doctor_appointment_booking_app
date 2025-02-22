
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateIdentificationDto{

    @IsNotEmpty() @IsString()
    identificationType:string

    @IsNotEmpty() @IsInt()
    identificationNumber:number

}