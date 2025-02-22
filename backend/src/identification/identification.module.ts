import { Module } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [IdentificationService,PrismaService],
  controllers: [IdentificationController]
})
export class IdentificationModule {}
