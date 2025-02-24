
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config()

@Injectable()
export class AiIntegrationService {
    private genAI: GoogleGenerativeAI;

    constructor(){
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new InternalServerErrorException('GEMINI_API_KEY is not defined');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
               {}}
        

        async getHealthAdvice(query:string):Promise<string>{
            const model  = this.genAI.getGenerativeModel({model:"gemini-pro"})
            const result =  await model.generateContent(query)
            return result.response.text();
        }
    
}
