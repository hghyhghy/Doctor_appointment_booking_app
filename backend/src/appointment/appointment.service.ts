import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentDto } from './create-appointment.dto';
import * as Twilio from 'twilio';

@Injectable()
export class AppointmentService {
    private twilioClient: Twilio.Twilio;

    constructor(private prisma: PrismaService) {
        this.twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
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
            throw new Error("Appointment date is missing or not in string format.");
        }

        // ✅ Debug: Log the received appointment date
        console.log("🟡 Received appointment date:", dto.appointmentDate);

        // ✅ Extract only the date part (remove time if present)
        const extractedDate = dto.appointmentDate.split(" ")[0]; // Keep only "DD-MM-YYYY"

        // ✅ Validate format (DD-MM-YYYY or DD.MM.YYYY)
        const dateRegex = /^\d{2}[-.]\d{2}[-.]\d{4}$/;
        if (!dateRegex.test(extractedDate)) {
            console.error("❌ Invalid date format:", extractedDate);
            throw new Error("Invalid appointment date format. Expected format: DD-MM-YYYY or DD.MM.YYYY");
        }

        console.log("✅ Valid appointment date format:", extractedDate);

        // ✅ Store the cleaned date string in the database
        const appointment = await this.prisma.appointment.upsert({
            where: { userId: Number(userId) },
            update: {
                preferredDoctor: dto.preferredDoctor,
                appointmentDate: extractedDate, // ✅ Store as string
                phoneNumber: dto.phoneNumber,
                reasons: dto.reasons,
                comments: dto.comments || null,
            },
            create: {
                userId,
                preferredDoctor: dto.preferredDoctor,
                appointmentDate: extractedDate, // ✅ Store as string
                phoneNumber: dto.phoneNumber,
                reasons: dto.reasons,
                comments: dto.comments || null,
            },
        });

        // ✅ Send SMS using the **exact user-given date**
        if (dto.phoneNumber) {
            await this.sendConfirmationSMS(dto.phoneNumber, user.id, dto.preferredDoctor, extractedDate);
        } else {
            console.warn("No phone number provided, skipping SMS confirmation.");
        }

        return appointment;
    }

    private async sendConfirmationSMS(phoneNumber: string, userId: number, doctor: string, userGivenDate: string) {
        const message = `Hello! Your appointment (ID: ${userId}) with Dr. ${doctor} is confirmed on ${userGivenDate}.`;

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
}
