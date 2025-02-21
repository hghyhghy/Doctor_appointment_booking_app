
import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')

export class AuthController {

    constructor(private authService:AuthService){}

    @Post('register')
    async register(@Body() body){

        return this.authService.register(body.email,body.password,body.name)
    }

    @Post('login')
    async login(@Body() body){

        const user  =  await this.authService.validateUser(body.name,body.password)
        if (!user){

            throw new  NotFoundException("Invalid Credentials")
        } ;

        return await this.authService.login(body.name, body.password)

    }
}