import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ReceiptService,PrismaService],
  controllers: [ReceiptController]
})
export class ReceiptModule {}
