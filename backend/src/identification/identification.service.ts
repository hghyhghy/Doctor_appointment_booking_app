
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateIdentificationDto } from './create-identification.dto';

@Injectable()
export class IdentificationService {
    constructor(private prisma:PrismaService){}

    async createIdentification(userId:number,dto:CreateIdentificationDto,filePath:string){
        
        const user  = await this.prisma.user.findUnique({
            where:{id:userId}
        })
        if(!user){
            throw new NotFoundException('User not found');
        }

        if(user){
            return this.prisma.identification.update({
                where:{userId:Number(userId)},
                data:{
                    identificationType:dto.identificationType,
                    identificationNumber:Number(dto.identificationNumber),
                    filePath:filePath
                }
            })
        }

        return this.prisma.identification.create({

            data:{
                userId,
                identificationType:dto.identificationType,
                identificationNumber:Number(dto.identificationNumber),
                filePath
            }
        })
    }
}
