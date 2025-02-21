
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MedicalInfoService } from './medical-info.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMedicalInfoDto } from './create-medical-info.dto';
import { Request as ExpressRequest } from 'express';

@Controller('medical-info')
export class MedicalInfoController {

    constructor(private readonly medicalService:MedicalInfoService){}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createMedicalInfo(@Req() req: ExpressRequest, @Body() dto: CreateMedicalInfoDto){

        
        if (!req.user) {
            throw new Error('User not found in request');
        }
        return this.medicalService.createMedicalInfo(req.user['id'], dto);
    }
}
