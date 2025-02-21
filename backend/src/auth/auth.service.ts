
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()

export  class AuthService {

    constructor (private jwtService : JwtService , private prisma:PrismaService){}

    async hashPassword(password:string): Promise<string>{

        return  await bcrypt.hash(password,10)
    }

    async validateUser(email:string,password:string) : Promise<{ id: number; email: string; name: string } | null>{

        const user = await this.prisma.user.findUnique({ where :{email}})
        if(user && ( await bcrypt.compare(password,user.password))){

            const {password , ...result} =  user
            return result;
        }

        return null

    }

    async login(user:any){

        const payload = { email:user.email, sub:user.id, name:user.name};
        return {

            access_token : this.jwtService.sign(payload)
        }
    }

    async register(email:string,password:string,name:string){

        const hashedpassword =  await  this.hashPassword(password)
        return this.prisma.user.create({

            data:{email,password:hashedpassword,name}
        });
    }
}