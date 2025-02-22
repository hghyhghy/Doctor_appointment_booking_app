import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { MedicalInfoModule } from './medical-info/medical-info.module';
import { IdentificationModule } from './identification/identification.module';

@Module({
  imports: [AuthModule,UserProfileModule, MedicalInfoModule, IdentificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
