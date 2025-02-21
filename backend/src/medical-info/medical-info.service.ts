
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMedicalInfoDto } from './create-medical-info.dto';

@Injectable()
export class MedicalInfoService {

    constructor(private prisma:PrismaService){}

    async createMedicalInfo(userId:number,dto:CreateMedicalInfoDto){

        const  userexists =  await this.prisma.medicalInfo.findUnique({

            where:{userId}
        })

        if(userexists){
            return await this.prisma.medicalInfo.update({
                where:{userId:Number(userId)},
                data:dto
            })
        };

        return await this.prisma.medicalInfo.create({
            data:{
                userId:Number(userId),
                ...dto
            }
        })
    }

}
