import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentDto } from './create-appointment.dto';
import * as Twilio from 'twilio';
import * as moment from 'moment';

@Injectable()
export class AppointmentService {
    private twilioClient: Twilio.Twilio;

    constructor(private prisma: PrismaService) {
        this.twilioClient = new Twilio.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    async createAppointment(userId: number, dto: CreateAppointmentDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!user) {
            throw new NotFoundException("User does not exist on record");
        }

        if (!dto.appointmentDate || typeof dto.appointmentDate !== "string") {
            console.error("❌ Appointment date is missing or not a string:", dto.appointmentDate);
            throw new Error("Appointment date is required and must be a string.");
        }

        // ✅ Debug: Log the received appointment date
        console.log("🟡 Received appointment date:", dto.appointmentDate);

        // ✅ Supported date formats
        const dateFormats = ["DD-MM-YYYY", "DD.MM.YYYY", "YYYY-MM-DD"];

        // ✅ Validate and normalize the date to "DD-MM-YYYY"
        const extractedDate = dto.appointmentDate.split(" ")[0]; 

        const parsedDate = moment(extractedDate, dateFormats, true);
        if (!parsedDate.isValid()) {
            console.error("❌ Invalid date format:", extractedDate);
            throw new Error("Invalid appointment date format. Expected formats: DD-MM-YYYY, DD.MM.YYYY, or YYYY-MM-DD.");
        }

        const formattedDate = parsedDate.toISOString(); 
        console.log("✅ Converted appointment date:", formattedDate);

        // ✅ Store the cleaned date string in the database
        const appointment = await this.prisma.appointment.upsert({
            where: { userId: Number(userId) },
            update: {
                preferredDoctor: dto.preferredDoctor,
                appointmentDate: formattedDate, // ✅ Stored as "DD-MM-YYYY"
                phoneNumber: dto.phoneNumber,
                reasons: dto.reasons,
                comments: dto.comments || null,
            },
            create: {
                userId,
                preferredDoctor: dto.preferredDoctor,
                appointmentDate: formattedDate, // ✅ Stored as "DD-MM-YYYY"
                phoneNumber: dto.phoneNumber,
                reasons: dto.reasons,
                comments: dto.comments || null,
            },
        });

        // ✅ Send SMS using the exact user-given date
        if (dto.phoneNumber) {
            await this.sendConfirmationSMS(dto.phoneNumber, user.id, dto.preferredDoctor, formattedDate);
        } else {
            console.warn("No phone number provided, skipping SMS confirmation.");
        }

        return appointment;
    }

    private async sendConfirmationSMS(phoneNumber: string, userId: number, doctor: string, appointmentDate: string) {
        const message = `Hello! Your appointment (ID: ${userId}) with ${doctor} is confirmed on ${appointmentDate}.`;

        try {
            await this.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });
            console.log("✅ SMS sent successfully!");
        } catch (error) {
            console.error("❌ Error sending SMS:", error);
        }
    }

    async getAppointments(userId: number) {
        return this.prisma.appointment.findMany({ where: { userId } });
    }

    async  getAppointmentCounts(){

        const total =  await  this.prisma.appointment.count()
        const schedule =  await this.prisma.appointment.count({

            where:{
                status:"scheduled"
            }
        })
        const cancelled  =  await this.prisma.appointment.count({
            where:{
                status:"cancelled"
            }
        })
        return {total,schedule,cancelled}
    }

    async getPendingAppointments(){
        return this.prisma.appointment.findMany({
            where:{status:"pending"},
            include:{
                user:{
                    select:{
                        name:true,
                        phoneNumber:true
                    }
                }
            }
        })
    }

    async findAll(){
        return this.prisma.appointment.findMany({
            include:{
                user:true
            }
            
        })
    }

    async scheduleAppointmentsForUser(userId: number) {

        const appointments = await this.prisma.appointment.findMany({ where: { userId:Number(userId), status: "pending" } });

        if (appointments.length === 0) {
            throw new NotFoundException('No pending appointments found for this user');
        }

        await this.prisma.appointment.updateMany({
            where: { userId, status: "pending" },
            data: { status: "scheduled" },
        });

        await this.sendSms(
            appointments[0].phoneNumber || '',
            `Dear ${appointments[0].userId}, all your appointments have been scheduled.`
        );

        return { message: 'Appointments scheduled successfully' };
    }


    async cancelAppointmentsForUser(userId: number) {
        const appointments = await this.prisma.appointment.findMany({ where: { userId:Number(userId), status: "pending" } });

        if (appointments.length === 0) {
            throw new NotFoundException('No pending appointments found for this user');
        }

        await this.prisma.appointment.updateMany({
            where: { userId, status: "pending" },
            data: { status: "cancelled" },
        });

        await this.sendSms(
            appointments[0].phoneNumber || '',
            `Dear ${appointments[0].userId}, all your appointments have been cancelled.`
        );

        return { message: 'Appointments cancelled successfully' };
    }



    private async sendSms(phoneNumber: string, message: string) {
        if (!phoneNumber) {
            console.warn("No phone number provided, skipping SMS.");
            return;
        }

        try {
            await this.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });
            console.log("✅ SMS sent successfully!");
        } catch (error) {
            console.error("❌ Error sending SMS:", error);
        }
    }
}


