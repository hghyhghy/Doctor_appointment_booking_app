

import { Controller, Post, UseInterceptors, UploadedFile, Body, Req, UseGuards } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { application, Request } from 'express';
import { CreateIdentificationDto } from './create-identification.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('identification')

export class IdentificationController {

    constructor(private readonly identificationService:IdentificationService){}

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(

        FileInterceptor('file',{

            storage:diskStorage({
                destination:"/uploads",
                filename:(req,file,callback) => {

                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null,uniqueSuffix+extname(file.originalname))
                }
            }),

            fileFilter:(req,file,callback) => {
                if(file.mimetype !== 'application/pdf'){
                    return callback(new Error('Only PDF files are allowed!'), false);
                }

                callback(null,true);
            }
        })
    )

    async create(@Req() req:Request,@Body() dto:CreateIdentificationDto,@UploadedFile() file:Express.Multer.File){
        if (!req.user) {
            throw new Error('User not found in request');
        }
        const userId =  req.user['id']
        return this.identificationService.createIdentification(userId,dto,file.path)

    }
}
