
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()

export  class AuthService {

    constructor (private jwtService : JwtService , private prisma:PrismaService){}

    async hashPassword(password:string): Promise<string>{

        return  await bcrypt.hash(password,10)
    }

    async validateUser(name:string,password:string) : Promise<{ id: number; name: string } | null>{

        const user = await this.prisma.user.findUnique({ where :{ name:name}})
        if(user && ( await bcrypt.compare(password,user.password))){

            const {password , ...result} =  user
            return result;
        }

        return null

    }

    async login(name:string,password:string){


        const user = await this.prisma.user.findUnique({where:{name}})
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
          }
        const payload = { sub: user.id, name: user.name };

            return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, name: user.name }, // Return user data as well
            };
  
    }

    async register(email:string,password:string,name:string){

        const hashedpassword =  await  this.hashPassword(password)
        return this.prisma.user.create({

            data:{email,password:hashedpassword,name}
        });
    }
}