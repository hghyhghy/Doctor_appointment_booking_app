
import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CreateUserProfileDto } from './create-user-profile.dto';


@Controller('profile')
export class UserProfileController {

    constructor(private readonly userprofileservice:UserProfileService){}

    @UseGuards(JwtAuthGuard)
    @Post("create")
    async  createProfile(@Req() req:Request,  @Body() dto:CreateUserProfileDto){

        if (!req.user) {
            throw new Error('User not found in request');
        }
        return this.userprofileservice.createProfile(req.user['id'], dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get("get")
    async getProfile(@Req() req:Request){

        if (!req.user) {
            throw new Error('User not found in request');
        }
        return this.userprofileservice.getProfile(req.user['id']);
    }

}