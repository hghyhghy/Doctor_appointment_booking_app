
import { AiIntegrationService } from './ai-integration.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('ai-integration')
export class AiIntegrationController {
    constructor(private readonly aiintegrationService: AiIntegrationService) {}

    @Post('health-advice')
    async getHealthAdvice(@Body('query') query:string){
        return this.aiintegrationService.getHealthAdvice(query)
    }
}
