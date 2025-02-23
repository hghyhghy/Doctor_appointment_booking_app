import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateIdentificationDto } from './create-identification.dto';

@Injectable()
export class IdentificationService {
    constructor(private prisma: PrismaService) {}

    async createIdentification(userId: number, dto: CreateIdentificationDto, filePath: string) {
        // Check if the user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if identification already exists for the user
        const existingIdentification = await this.prisma.identification.findUnique({
            where: { userId: userId },
        });

        if (existingIdentification) {
            // Update existing identification
            return this.prisma.identification.update({
                where: { userId: userId },
                data: {
                    identificationType: dto.identificationType,
                    identificationNumber: Number(dto.identificationNumber),
                    filePath: filePath,
                },
            });
        }

        // Create new identification
        return this.prisma.identification.create({
            data: {
                userId,
                identificationType: dto.identificationType,
                identificationNumber: Number(dto.identificationNumber),
                filePath,
            },
        });
    }
}
