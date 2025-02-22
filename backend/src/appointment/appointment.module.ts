import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AppointmentService,PrismaService],
  controllers: [AppointmentController]
})
export class AppointmentModule {}
