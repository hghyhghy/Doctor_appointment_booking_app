

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './create-user-profile.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserProfileService {

    constructor(private prisma:PrismaService){}

    async  createProfile(userId:number, dto: CreateUserProfileDto){
        const userexists  =  await this.prisma.userProfile.findUnique({

            where:{userId:Number(userId)}
        })
        if (userexists){

            return await this.prisma.userProfile.update({

                where:{userId:Number(userId)},
                data:dto
            })
        }
        return await this.prisma.userProfile.create({

            data:{

                userId,
                name: dto.name,
                phoneNumber: dto.phoneNumber,
                dateOfBirth: new Date(dto.dateOfBirth), // ✅ Convert string to Date
                gender: dto.gender,
                address: dto.address,
                occupation: dto.occupation,
                emergencyContact: dto.emergencyContact,
            }
        });
    }

    async  getProfile(userId:number){

        const profile = await this.prisma.userProfile.findUnique({

            where:{userId:Number(userId)}
        });
        if (! profile){
            throw  new NotFoundException("User Profile Not Found")
        }

        return profile
    }
}