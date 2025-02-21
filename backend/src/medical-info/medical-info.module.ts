import { Module } from '@nestjs/common';
import { MedicalInfoController } from './medical-info.controller';
import { MedicalInfoService } from './medical-info.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MedicalInfoController],
  providers: [MedicalInfoService,PrismaService]
})
export class MedicalInfoModule {}
