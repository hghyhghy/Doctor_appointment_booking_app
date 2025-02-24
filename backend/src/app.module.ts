import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { MedicalInfoModule } from './medical-info/medical-info.module';
import { IdentificationModule } from './identification/identification.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AdminModule } from './admin/admin.module';
import { ModuleController } from './module/module.controller';
import { ReceiptModule } from './receipt/receipt.module';
import { AiIntegrationModule } from './ai-integration/ai-integration.module';

@Module({
  imports: [AuthModule,UserProfileModule, MedicalInfoModule, IdentificationModule, AppointmentModule, AdminModule, ReceiptModule, AiIntegrationModule],
  controllers: [AppController, ModuleController],
  providers: [AppService],
})
export class AppModule {}
