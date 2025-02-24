
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReceiptService } from './receipt.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';

@Controller('receipt')
export class ReceiptController {
    constructor(private  readonly recepeintService:ReceiptService){}

    @Get(":userId")
    @UseGuards(JwtAuthGuard)
    async getAppointmentReceipt(@Param('userId') userId:string){
        return this.recepeintService.getAppointmentReceipt(Number(userId))
    }
}
