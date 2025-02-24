

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import {AppointmentReceiptDto} from "./appointment-receipt.dto";

@Injectable()
export class ReceiptService {
    constructor(private prisma:PrismaService){}

    async getAppointmentReceipt(userId:number):Promise<AppointmentReceiptDto>{

        const appointment =  await this.prisma.appointment.findUnique({
            where:{userId:Number(userId)},
            include:{
                user:true
            }
        });

        if(!appointment){
            throw new NotFoundException('Appointment not found');
        }

        return{
            userId:appointment.userId,
            patientName:appointment.user.name,
            phoneNumber:appointment.phoneNumber,
            doctorName:appointment.preferredDoctor,
            appointmentDate:appointment.appointmentDate,
            reason:appointment.reasons
            

        }

    }    
}
