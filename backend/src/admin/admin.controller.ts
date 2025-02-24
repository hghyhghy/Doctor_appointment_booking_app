
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('admin')
export class AdminController {
    private readonly PASSKEY  = process.env.ADMIN_PASSKEY

    @Post('validate-passkey')
    async validatePasskey(@Body('passkey') passkey:string){
        if (passkey != this.PASSKEY){
            throw new UnauthorizedException("Access Denied  ")
        }else{
            return { success: true, message: 'Access Granted' };
        }
    }
}
