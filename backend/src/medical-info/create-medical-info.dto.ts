
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicalInfoDto {

    @IsNotEmpty() @IsString()
    physicianName:string

    @IsNotEmpty()@IsString()
    insuranceProvider:string

    @IsNotEmpty()@IsString()
    insuranceNumber:string

    @IsNotEmpty()@IsString()
    allergies:string

    @IsNotEmpty()@IsString()
    currentMedicalSituation:string

    @IsNotEmpty()@IsString()
    familyMedicalHistory:string

    @IsNotEmpty()@IsString()
    pastMedicalHistory:string
}