
import { IsNotEmpty, IsOptional, IsString, IsDate, Matches } from 'class-validator';

export class CreateAppointmentDto{

    @IsNotEmpty()
    @IsString()
    preferredDoctor: string;
  
    @IsNotEmpty()
    @IsString()
    appointmentDate: string
  
    @IsNotEmpty()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
    phoneNumber: string;
  
    @IsNotEmpty()
    @IsString()
    reasons: string;
  
    @IsOptional()
    @IsString()
    comments?: string;

}