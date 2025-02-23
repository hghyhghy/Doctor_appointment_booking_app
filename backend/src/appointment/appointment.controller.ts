

import { Controller, Post, Get, Body, Req, UseGuards, Patch, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Request } from 'express';
import { CreateAppointmentDto } from './create-appointment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('appointment')
export class AppointmentController {

    constructor (private readonly appointmentService:AppointmentService){}
    @Post('book')
    @UseGuards(JwtAuthGuard)
    async  bookAppointment(@Req() req:Request, @Body() dto:CreateAppointmentDto){
        if (!req.user) {
            throw new Error('User not found in request');
        }
        const userId =  req.user['id']

        const appointment  =  await this.appointmentService.createAppointment(userId,dto)
        return {appointment}
    }

    @Get("my-appointments")
    @UseGuards(JwtAuthGuard)
    async getUserAppointments(@Req() req:Request){
        const userId = (req.user as any)?.id;

        if (!userId) return { message: 'User not found in request' };
        const appointments = await this.appointmentService.getAppointments(userId)
        return {appointments}
    
    }

    @Get('counts')
    // @UseGuards(JwtAuthGuard)
    async getAppointmentCounts(){
        const counts =  await this.appointmentService.getAppointmentCounts()
        return counts
    }

    @Get('pending')
    // @UseGuards(JwtAuthGuard)
    async getPendingAppointments(){
        const pending  =  await this.appointmentService.getPendingAppointments()
        return pending 
    }

    @Get('all')
    // @UseGuards(JwtAuthGuard)
    async getScheduledAppointments(){
        const pending  =  await this.appointmentService.getScheduledAppointments()
        return pending 
    }

    @Patch('schedule/:userId')
    async scheduleAppointments(@Param('userId') userId: string) {
        const response = await this.appointmentService.scheduleAppointmentsForUser(Number(userId));
        return response;
    }
    
    @Patch('cancel/:userId')
    async cancelAppointments(@Param('userId') userId: string) {
        const response = await this.appointmentService.cancelAppointmentsForUser(Number(userId));
        return response;
    }
}
